// Art Detective - Main Application

class ArtViewer {
    constructor() {
        // DOM Elements
        this.viewer = document.getElementById('viewer');
        this.artworkImage = document.getElementById('artworkImage');
        this.hotspotsContainer = document.getElementById('hotspotsContainer');
        this.galleryThumbnails = document.getElementById('galleryThumbnails');
        this.detailPanel = document.getElementById('detailPanel');
        this.overlay = document.getElementById('overlay');

        // Info elements
        this.artworkTitle = document.getElementById('artworkTitle');
        this.artworkArtist = document.getElementById('artworkArtist');
        this.artworkDescription = document.getElementById('artworkDescription');

        // Detail panel elements
        this.detailTitle = document.getElementById('detailTitle');
        this.detailImage = document.getElementById('detailImage');
        this.detailDescription = document.getElementById('detailDescription');

        // Zoom/Pan state
        this.scale = 1;
        this.minScale = 0.5;
        this.maxScale = 5;
        this.translateX = 0;
        this.translateY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;

        // Current artwork
        this.currentArtwork = null;
        this.viewedHotspots = new Set();

        this.init();
    }

    init() {
        this.renderGallery();
        this.bindEvents();

        // Load first artwork by default
        if (artworks.length > 0) {
            this.loadArtwork(artworks[0]);
        }
    }

    renderGallery() {
        this.galleryThumbnails.innerHTML = artworks.map((artwork, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${artwork.thumbnail || artwork.image}" alt="${artwork.title}">
                <div class="thumbnail-label">${artwork.title}</div>
            </div>
        `).join('');
    }

    bindEvents() {
        // Gallery thumbnail clicks
        this.galleryThumbnails.addEventListener('click', (e) => {
            const thumbnail = e.target.closest('.thumbnail');
            if (thumbnail) {
                const index = parseInt(thumbnail.dataset.index);
                this.loadArtwork(artworks[index]);

                // Update active state
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
            }
        });

        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => this.zoom(1.3));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoom(0.7));
        document.getElementById('zoomReset').addEventListener('click', () => this.resetView());

        // Mouse wheel zoom
        this.viewer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoomAtPoint(delta, e.clientX, e.clientY);
        }, { passive: false });

        // Pan functionality
        this.viewer.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());

        // Touch support
        this.viewer.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]), { passive: true });
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.drag(e.touches[0]);
            }
        }, { passive: false });
        document.addEventListener('touchend', () => this.endDrag());

        // Detail panel
        document.getElementById('closeDetail').addEventListener('click', () => this.closeDetail());
        this.overlay.addEventListener('click', () => this.closeDetail());

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeDetail();
            if (e.key === '+' || e.key === '=') this.zoom(1.3);
            if (e.key === '-') this.zoom(0.7);
            if (e.key === '0') this.resetView();
        });
    }

    loadArtwork(artwork) {
        this.currentArtwork = artwork;
        this.viewedHotspots.clear();

        // Update info
        this.artworkTitle.textContent = artwork.title;
        this.artworkArtist.textContent = artwork.artist ? `by ${artwork.artist}` : '';
        this.artworkDescription.textContent = artwork.description || '';

        // Load image
        this.viewer.classList.add('loading');
        this.artworkImage.onload = () => {
            this.viewer.classList.remove('loading');
            this.resetView();
            this.renderHotspots();
        };
        this.artworkImage.src = artwork.image;
    }

    renderHotspots() {
        if (!this.currentArtwork || !this.currentArtwork.hotspots) {
            this.hotspotsContainer.innerHTML = '';
            return;
        }

        this.hotspotsContainer.innerHTML = this.currentArtwork.hotspots.map((hotspot, index) => `
            <div class="hotspot ${this.viewedHotspots.has(index) ? 'viewed' : ''}"
                 data-index="${index}"
                 style="left: ${hotspot.x}%; top: ${hotspot.y}%;">
            </div>
        `).join('');

        // Bind hotspot clicks
        this.hotspotsContainer.querySelectorAll('.hotspot').forEach(hotspot => {
            hotspot.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(hotspot.dataset.index);
                this.showDetail(index);
            });
        });

        this.updateHotspotsTransform();
    }

    showDetail(index) {
        const hotspot = this.currentArtwork.hotspots[index];
        if (!hotspot) return;

        // Mark as viewed
        this.viewedHotspots.add(index);
        const hotspotEl = this.hotspotsContainer.querySelector(`[data-index="${index}"]`);
        if (hotspotEl) hotspotEl.classList.add('viewed');

        // Zoom to hotspot
        this.zoomToHotspot(hotspot);

        // Show detail panel
        this.detailTitle.textContent = hotspot.title;
        this.detailDescription.textContent = hotspot.description;

        if (hotspot.detailImage) {
            this.detailImage.src = hotspot.detailImage;
            this.detailImage.parentElement.style.display = 'block';
        } else {
            this.detailImage.parentElement.style.display = 'none';
        }

        this.detailPanel.classList.add('active');
        this.overlay.classList.add('active');
    }

    closeDetail() {
        this.detailPanel.classList.remove('active');
        this.overlay.classList.remove('active');
    }

    zoomToHotspot(hotspot) {
        // Calculate target position to center the hotspot
        const viewerRect = this.viewer.getBoundingClientRect();
        const imgRect = this.artworkImage.getBoundingClientRect();

        // Target zoom level
        this.scale = 2.5;

        // Calculate hotspot position in pixels relative to image
        const hotspotX = (hotspot.x / 100) * this.artworkImage.naturalWidth;
        const hotspotY = (hotspot.y / 100) * this.artworkImage.naturalHeight;

        // Calculate scaled image dimensions
        const scaledWidth = this.artworkImage.naturalWidth * this.scale;
        const scaledHeight = this.artworkImage.naturalHeight * this.scale;

        // Calculate translation to center the hotspot
        this.translateX = (viewerRect.width / 2) - (hotspotX * this.scale);
        this.translateY = (viewerRect.height / 2) - (hotspotY * this.scale);

        this.applyTransform();
    }

    zoom(factor) {
        const newScale = this.scale * factor;
        if (newScale >= this.minScale && newScale <= this.maxScale) {
            this.scale = newScale;
            this.applyTransform();
        }
    }

    zoomAtPoint(factor, clientX, clientY) {
        const viewerRect = this.viewer.getBoundingClientRect();
        const mouseX = clientX - viewerRect.left;
        const mouseY = clientY - viewerRect.top;

        const newScale = Math.min(Math.max(this.scale * factor, this.minScale), this.maxScale);

        // Adjust translation to zoom towards mouse position
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
        const transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
        this.artworkImage.style.transform = transform;
        this.updateHotspotsTransform();
    }

    updateHotspotsTransform() {
        // Scale hotspots inversely to maintain constant size
        const hotspots = this.hotspotsContainer.querySelectorAll('.hotspot');
        const imgRect = this.artworkImage.getBoundingClientRect();
        const viewerRect = this.viewer.getBoundingClientRect();

        hotspots.forEach(hotspot => {
            const x = parseFloat(hotspot.style.left);
            const y = parseFloat(hotspot.style.top);

            // Calculate absolute position based on current image transform
            const absX = (imgRect.left - viewerRect.left) + (x / 100) * imgRect.width;
            const absY = (imgRect.top - viewerRect.top) + (y / 100) * imgRect.height;

            hotspot.style.left = `${absX}px`;
            hotspot.style.top = `${absY}px`;

            // Keep hotspot size constant regardless of zoom
            const inverseScale = 1 / this.scale;
            hotspot.style.transform = `translate(-50%, -50%) scale(${Math.max(inverseScale, 0.5)})`;
        });
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.artViewer = new ArtViewer();
});
