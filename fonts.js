// Font definitions - easily extensible
const FONTS = {
    'jetbrains-mono': {
        name: 'JetBrains Mono',
        family: "'JetBrains Mono', monospace",
        weight: 400,
        lineHeight: 1.6,
        letterSpacing: 0,
        // Google Fonts or CDN URL
        url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap'
    }
    
    // Easy to add more fonts:
    // 'fira-code': {
    //     name: 'Fira Code',
    //     family: "'Fira Code', monospace",
    //     weight: 400,
    //     lineHeight: 1.5,
    //     letterSpacing: 0,
    //     url: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap'
    // },
    // 'source-code-pro': {
    //     name: 'Source Code Pro',
    //     family: "'Source Code Pro', monospace",
    //     weight: 400,
    //     lineHeight: 1.5,
    //     letterSpacing: 0,
    //     url: 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600;700&display=swap'
    // },
    // 'cascadia-code': {
    //     name: 'Cascadia Code',
    //     family: "'Cascadia Code', monospace",
    //     weight: 400,
    //     lineHeight: 1.5,
    //     letterSpacing: 0,
    //     url: 'https://fonts.googleapis.com/css2?family=Cascadia+Code:wght@400;500;600;700&display=swap'
    // }
};

// Get font by id
function getFont(fontId) {
    return FONTS[fontId] || FONTS['jetbrains-mono'];
}

// Get all available fonts
function getAllFonts() {
    return Object.keys(FONTS).map(key => ({
        id: key,
        name: FONTS[key].name
    }));
}

// Load a font dynamically
function loadFont(fontId) {
    const font = getFont(fontId);
    if (!font.url) return;
    
    // Check if already loaded
    const existingLink = document.querySelector(`link[href="${font.url}"]`);
    if (existingLink) return;
    
    // Create and append link tag
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = font.url;
    document.head.appendChild(link);
}
