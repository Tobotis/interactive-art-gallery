// Sample artworks data with hotspots
// Replace image URLs with your own artwork images
// Hotspot x/y positions are percentages (0-100) from top-left
// Hotspot zoom levels can be set per-hotspot (default: 4)

const artworks = [
    {
        id: 1,
        title: "Suspicious Starry Night",
        artist: "Unknown (Claimed: Van Gogh)",
        description: "This alleged Van Gogh has several telltale signs of forgery. Examine the hotspots to learn why experts believe this is a fake.",
        image: "images/example3.png",
        thumbnail: "images/example3.png",
        hotspots: [
            {
                x: 25,
                y: 30,
                zoom: 5,
                title: "Brushwork Inconsistency",
                description: "Van Gogh's signature impasto technique shows thick, confident strokes with visible texture. This area shows hesitant, thin brushwork typical of someone trying to imitate his style. The paint layer is too uniform and lacks the dimensional quality of authentic Van Gogh paintings.",
            },
            {
                x: 70,
                y: 25,
                title: "Pigment Analysis Failure",
                description: "Spectroscopic analysis revealed synthetic pigments that weren't available until 1950 - over 60 years after Van Gogh's death. The cobalt blue used here contains titanium dioxide, a compound not used in artists' paints until the mid-20th century.",
            },
            {
                x: 45,
                y: 65,
                title: "Canvas Weave Pattern",
                description: "The canvas weave pattern is machine-made with perfect regularity. In Van Gogh's era, canvas was hand-woven with slight irregularities. This mechanical precision indicates a canvas manufactured after 1920.",
            },
            {
                x: 80,
                y: 70,
                zoom: 6,
                title: "Signature Anomaly",
                description: "The signature 'Vincent' appears copied from a known photograph of Van Gogh's signature. When overlaid digitally, it matches too perfectly - genuine signatures always have natural variations even when signed by the same person.",
            }
        ]
    },
    {
        id: 2,
        title: "The Questionable Portrait",
        artist: "Unknown (Claimed: Rembrandt)",
        description: "This portrait was once valued at millions until experts discovered multiple anachronisms. Click on the highlighted areas to see the evidence.",
        image: "images/example2.png",
        thumbnail: "images/example2.png",
        hotspots: [
            {
                x: 50,
                y: 20,
                title: "Hat Style Anachronism",
                description: "The hat depicted is a style that didn't become fashionable until 50 years after Rembrandt's death. This type of tricorn with the specific fold pattern wasn't worn in the Dutch Golden Age. Historical fashion experts confirmed this style emerged around 1720.",
            },
            {
                x: 35,
                y: 45,
                zoom: 6,
                title: "Button Manufacturing",
                description: "Close examination reveals buttons with four-hole machine-drilled pattern. In Rembrandt's time, buttons were either single-shank or hand-drilled with irregular holes. Machine-drilled buttons weren't common until the Industrial Revolution.",
            },
            {
                x: 65,
                y: 55,
                title: "Lighting Inconsistency",
                description: "Rembrandt was famous for his masterful use of chiaroscuro - dramatic light and shadow. Here, the light source appears to come from two different directions simultaneously, something Rembrandt would never have done. The shadow under the nose conflicts with the highlight on the cheek.",
            },
            {
                x: 50,
                y: 80,
                title: "Ground Layer Analysis",
                description: "X-ray analysis revealed a ground layer containing zinc white, which wasn't used in painting grounds until the 19th century. Rembrandt typically used lead white and chalk grounds. This is definitive proof of later creation.",
            }
        ]
    },
    {
        id: 3,
        title: "Mediterranean Landscape",
        artist: "Unknown (Claimed: Monet)",
        description: "Sold at auction as a Monet, this Impressionist landscape was later proved to be a skilled 20th-century forgery. Discover the clues that unmasked it.",
        image: "images/example1.png",
        thumbnail: "images/example1.png",
        hotspots: [
            {
                x: 20,
                y: 40,
                title: "Architectural Impossibility",
                description: "The building in this scene shows architectural features that didn't exist in the 1880s Mediterranean. The window style and roof construction are consistent with post-1950 renovation methods. The forger likely used a modern photograph as reference.",
            },
            {
                x: 75,
                y: 35,
                title: "Tree Species Error",
                description: "The trees depicted are Eucalyptus globulus, which wasn't introduced to southern France until 1920. Monet couldn't have painted this species in the 1880s because it simply wasn't there. The forger made a basic botanical error.",
            },
            {
                x: 50,
                y: 75,
                title: "Provenance Gap",
                description: "The painting's ownership history has a suspicious 40-year gap between 1920-1960. During this period, many forgeries were created. No photographs, exhibition records, or correspondence mention this work before 1962.",
            }
        ]
    },
    {
        id: 4,
        title: "Abstract Composition #7",
        artist: "Unknown (Claimed: Kandinsky)",
        description: "This abstract work claimed to be an early Kandinsky was exposed through scientific analysis. The evidence is hidden in the details.",
        image: "images/example4.png",
        thumbnail: "images/example4.png",
        hotspots: [
            {
                x: 30,
                y: 30,
                title: "Synthetic Polymer Detection",
                description: "Infrared spectroscopy detected polyvinyl acetate (PVA) in the paint medium. PVA wasn't synthesized until 1912 and wasn't used in artist paints until the 1930s. This painting is allegedly from 1910.",
            },
            {
                x: 60,
                y: 50,
                title: "Geometric Proportions",
                description: "Computer analysis revealed the geometric shapes follow proportions based on A4 paper ratios, standardized in 1975. Kandinsky used classical proportions like the golden ratio. This mathematical anachronism betrays modern creation.",
            },
            {
                x: 45,
                y: 70,
                title: "Color Theory Mismatch",
                description: "Kandinsky wrote extensively about his color theories. The color combinations here violate his documented principles - he never placed these specific hues adjacent. The forger didn't study Kandinsky's theoretical writings.",
            },
            {
                x: 80,
                y: 25,
                title: "Canvas Dating",
                description: "Radiocarbon dating of the canvas fibers places their origin between 1955-1965. Kandinsky died in 1944. The canvas itself proves the work is a post-mortem forgery.",
            }
        ]
    },
    {
        id: 5,
        title: "Still Life with Flowers",
        artist: "Unknown (Claimed: Dutch Master)",
        description: "This elaborate floral still life has fooled collectors for decades. Recent technology revealed its true nature as a sophisticated modern fake.",
        image: "images/example5.png",
        thumbnail: "images/example5.png",
        hotspots: [
            {
                x: 40,
                y: 25,
                title: "Hybrid Flower Variety",
                description: "The central tulip is a 'Queen of Night' variety, first bred in 1944. This dark purple, almost black tulip couldn't have existed in 17th-century Dutch paintings. The forger included a favorite modern flower without checking its history.",
            },
            {
                x: 25,
                y: 55,
                title: "Glass Manufacturing Clue",
                description: "The vase shows perfect clarity only achievable with modern manufacturing. 17th-century glass contained bubbles and slight green tinting from iron impurities. This crystal clarity is a 20th-century achievement.",
            },
            {
                x: 70,
                y: 45,
                title: "Insect Species Error",
                description: "The butterfly depicted is a Painted Lady, but with wing patterns matching the American subspecies, not the European one Dutch painters would have observed. The forger likely used an American field guide as reference.",
            },
            {
                x: 55,
                y: 80,
                title: "Table Edge Reflection",
                description: "The reflection on the table shows a subtle image of overhead fluorescent lighting - a technology invented in 1926. The forger painted what they saw in their modern studio without realizing they were leaving evidence.",
            }
        ]
    }
];
