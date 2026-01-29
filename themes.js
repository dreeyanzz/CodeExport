// Theme definitions - easily extensible
const THEMES = {
    palenight: {
        name: 'Palenight',
        background: '#292d3e',
        foreground: '#a6accd',
        selection: '#717cb450',
        comment: '#676e95',
        cyan: '#89ddff',
        green: '#c3e88d',
        orange: '#f78c6c',
        pink: '#c792ea',
        red: '#f07178',
        yellow: '#ffcb6b',
        blue: '#82aaff',
        purple: '#c792ea',
        lineHighlight: '#32374d',
        
        // Token color mappings
        tokens: {
            keyword: '#c792ea',
            string: '#c3e88d',
            number: '#f78c6c',
            comment: '#676e95',
            function: '#82aaff',
            class: '#ffcb6b',
            variable: '#a6accd',
            operator: '#89ddff',
            punctuation: '#89ddff',
            type: '#ffcb6b',
            namespace: '#82aaff',
            attribute: '#c792ea',
            property: '#a6accd',
            constant: '#f78c6c',
            escape: '#89ddff'
        }
    }
    
    // Easy to add more themes:
    // dracula: { ... },
    // monokai: { ... },
    // solarized: { ... }
};

// Get theme by name
function getTheme(themeName) {
    return THEMES[themeName] || THEMES.palenight;
}

// Get all available themes
function getAllThemes() {
    return Object.keys(THEMES).map(key => ({
        id: key,
        name: THEMES[key].name
    }));
}
