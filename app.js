class ArtViewer {
    constructor() {
        this.viewer = document.getElementById('viewer');
        this.imageWrapper = document.getElementById('imageWrapper');
        this.artworkImage = document.getElementById('artworkImage');
        this.galleryList = document.getElementById('galleryList');
        this.detailPanel = document.getElementById('detailPanel');
        this.overlay = document.getElementById('overlay');
        this.detailTitle = document.getElementById('detailTitle');
        this.detailDescription = document.getElementById('detailDescription');

        // Sidebar description elements
        this.descTitle = document.getElementById('descTitle');
        this.descArtist = document.getElementById('descArtist');
        this.descText = document.getElementById('descText');

        // Transform state
        this.scale = 1;
        this.minScale = 0.5;
        this.maxScale = 5;
        this.translateX = 0;
        this.translateY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;

        this.currentArtwork = null;
        this.viewedHotspots = new Set();

        this.init();
    }

    init() {
        this.renderGallery();
        this.bindEvents();
        if (artworks.length > 0) {
            this.loadArtwork(artworks[0]);
        }
    }

    renderGallery() {
        this.galleryList.innerHTML = artworks.map((artwork, index) => `
            <div class="gallery-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${artwork.thumbnail || artwork.image}" alt="${artwork.title}">
                <div class="gallery-item-info">
                    <div class="gallery-item-title">${artwork.title}</div>
                    <div class="gallery-item-artist">${artwork.artist || ''}</div>
                </div>
            </div>
        `).join('');
    }

    bindEvents() {
        // Gallery clicks
        this.galleryList.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (item) {
                const index = parseInt(item.dataset.index);
                this.loadArtwork(artworks[index]);
                document.querySelectorAll('.gallery-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
            }
        });

        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => this.zoom(1.4));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoom(0.7));
        document.getElementById('zoomReset').addEventListener('click', () => this.resetView());

        // Mouse wheel zoom
        this.viewer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoomAtPoint(delta, e.clientX, e.clientY);
        }, { passive: false });

        // Pan
        this.viewer.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());

        // Touch support
        let lastTouchDist = 0;
        this.viewer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                this.startDrag(e.touches[0]);
            } else if (e.touches.length === 2) {
                lastTouchDist = this.getTouchDistance(e.touches);
            }
        }, { passive: true });

        this.viewer.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && this.isDragging) {
                e.preventDefault();
                this.drag(e.touches[0]);
            } else if (e.touches.length === 2) {
                e.preventDefault();
                const dist = this.getTouchDistance(e.touches);
                const scale = dist / lastTouchDist;
                this.zoom(scale);
                lastTouchDist = dist;
            }
        }, { passive: false });

        document.addEventListener('touchend', () => this.endDrag());

        // Detail panel
        document.getElementById('closeDetail').addEventListener('click', () => this.closeDetail());
        this.overlay.addEventListener('click', () => this.closeDetail());

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeDetail();
            if (e.key === '+' || e.key === '=') this.zoom(1.3);
            if (e.key === '-') this.zoom(0.7);
            if (e.key === '0') this.resetView();
        });
    }

    getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    loadArtwork(artwork) {
        this.currentArtwork = artwork;
        this.viewedHotspots.clear();

        // Update sidebar description
        this.descTitle.textContent = artwork.title;
        this.descArtist.textContent = artwork.artist || '';
        this.descText.textContent = artwork.description || '';

        this.artworkImage.onload = () => {
            this.resetView();
            this.renderHotspots();
        };
        this.artworkImage.src = artwork.image;
    }

    renderHotspots() {
        // Remove existing hotspots
        this.imageWrapper.querySelectorAll('.hotspot').forEach(el => el.remove());

        if (!this.currentArtwork?.hotspots) return;

        this.currentArtwork.hotspots.forEach((hotspot, index) => {
            const el = document.createElement('div');
            el.className = `hotspot ${this.viewedHotspots.has(index) ? 'viewed' : ''}`;
            el.dataset.index = index;
            // Position as percentage of image dimensions
            el.style.left = `${hotspot.x}%`;
            el.style.top = `${hotspot.y}%`;

            el.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showDetail(index);
            });

            this.imageWrapper.appendChild(el);
        });
    }

    showDetail(index) {
        const hotspot = this.currentArtwork.hotspots[index];
        if (!hotspot) return;

        this.viewedHotspots.add(index);
        const el = this.imageWrapper.querySelector(`[data-index="${index}"]`);
        if (el) el.classList.add('viewed');

        // Zoom to hotspot
        this.zoomToHotspot(hotspot);

        this.detailTitle.textContent = hotspot.title;
        this.detailDescription.textContent = hotspot.description;

        this.detailPanel.classList.add('active');
    }

    zoomToHotspot(hotspot) {
        const imgWidth = this.artworkImage.offsetWidth;
        const imgHeight = this.artworkImage.offsetHeight;

        // Use hotspot-specific zoom level, default to 4x
        const targetScale = hotspot.zoom || 4;

        // Hotspot position relative to image center (in pixels at scale 1)
        const hotspotX = (hotspot.x / 100 - 0.5) * imgWidth;
        const hotspotY = (hotspot.y / 100 - 0.5) * imgHeight;

        // Calculate translation to center the hotspot in the viewer
        this.scale = targetScale;
        this.translateX = -hotspotX * targetScale;
        this.translateY = -hotspotY * targetScale;

        this.applyTransformAnimated();
    }

    applyTransformAnimated() {
        this.imageWrapper.style.transition = 'transform 0.4s ease-out';
        this.imageWrapper.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;

        // Remove transition after animation completes
        setTimeout(() => {
            this.imageWrapper.style.transition = '';
        }, 400);
    }

    closeDetail() {
        this.detailPanel.classList.remove('active');
    }

    zoom(factor) {
        const newScale = Math.min(Math.max(this.scale * factor, this.minScale), this.maxScale);
        this.scale = newScale;
        this.applyTransform();
    }

    zoomAtPoint(factor, clientX, clientY) {
        const rect = this.viewer.getBoundingClientRect();
        const mouseX = clientX - rect.left - rect.width / 2;
        const mouseY = clientY - rect.top - rect.height / 2;

        const newScale = Math.min(Math.max(this.scale * factor, this.minScale), this.maxScale);
        const scaleChange = newScale / this.scale;

        this.translateX = mouseX - (mouseX - this.translateX) * scaleChange;
        this.translateY = mouseY - (mouseY - this.translateY) * scaleChange;
        this.scale = newScale;

        this.applyTransform();
    }

    resetView() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.applyTransform();
    }

    startDrag(e) {
        if (e.target.classList.contains('hotspot')) return;
        this.isDragging = true;
        this.startX = e.clientX - this.translateX;
        this.startY = e.clientY - this.translateY;
        this.viewer.style.cursor = 'grabbing';
    }

    drag(e) {
        if (!this.isDragging) return;
        this.translateX = e.clientX - this.startX;
        this.translateY = e.clientY - this.startY;
        this.applyTransform();
    }

    endDrag() {
        this.isDragging = false;
        this.viewer.style.cursor = 'grab';
    }

    applyTransform() {
        this.imageWrapper.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.artViewer = new ArtViewer();
});
