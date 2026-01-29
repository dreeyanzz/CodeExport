// Language syntax definitions - easily extensible
const LANGUAGES = {
    csharp: {
        name: 'C#',
        fileExtension: '.cs',
        
        // Token patterns (order matters - more specific patterns first)
        patterns: [
            // Multi-line comments
            {
                type: 'comment',
                pattern: /\/\*[\s\S]*?\*\//g
            },
            // Single-line comments
            {
                type: 'comment',
                pattern: /\/\/.*/g
            },
            // Strings (with escape sequences)
            {
                type: 'string',
                pattern: /@?"(?:[^"\\]|\\.)*"/g
            },
            // Character literals
            {
                type: 'string',
                pattern: /'(?:[^'\\]|\\.)*'/g
            },
            // Keywords
            {
                type: 'keyword',
                pattern: /\b(abstract|as|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|volatile|while|add|alias|ascending|async|await|by|descending|dynamic|equals|from|get|global|group|into|join|let|nameof|on|orderby|partial|remove|select|set|value|var|when|where|yield)\b/g
            },
            // Preprocessor directives
            {
                type: 'keyword',
                pattern: /#(if|else|elif|endif|define|undef|warning|error|line|region|endregion|pragma)\b/g
            },
            // Attributes
            {
                type: 'attribute',
                pattern: /\[([^\]]+)\]/g
            },
            // Numbers (hex, binary, decimal, float)
            {
                type: 'number',
                pattern: /\b(0x[0-9a-fA-F]+|0b[01]+|\d+\.?\d*[fFdDmM]?)\b/g
            },
            // Type names (PascalCase identifiers)
            {
                type: 'type',
                pattern: /\b[A-Z][a-zA-Z0-9_]*\b/g
            },
            // Function/Method calls
            {
                type: 'function',
                pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g
            },
            // Operators
            {
                type: 'operator',
                pattern: /[+\-*/%=<>!&|^~?:]+|&&|\|\||<<|>>|==|!=|<=|>=|\+\+|--|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<=|>>=|=>|\?\?/g
            },
            // Punctuation
            {
                type: 'punctuation',
                pattern: /[{}[\]();,.\:]/g
            }
        ]
    }
    
    // Easy to add more languages:
    // javascript: { ... },
    // python: { ... },
    // java: { ... }
};

// Get language by id
function getLanguage(languageId) {
    return LANGUAGES[languageId] || LANGUAGES.csharp;
}

// Get all available languages
function getAllLanguages() {
    return Object.keys(LANGUAGES).map(key => ({
        id: key,
        name: LANGUAGES[key].name
    }));
}

// Tokenize code based on language patterns
function tokenize(code, languageId) {
    const language = getLanguage(languageId);
    const tokens = [];
    let processedCode = code;
    const matches = [];
    
    // Collect all matches with their positions
    language.patterns.forEach(pattern => {
        const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
        let match;
        
        while ((match = regex.exec(code)) !== null) {
            matches.push({
                type: pattern.type,
                text: match[0],
                start: match.index,
                end: match.index + match[0].length
            });
        }
    });
    
    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);
    
    // Remove overlapping matches (keep first match)
    const filteredMatches = [];
    let lastEnd = 0;
    
    for (const match of matches) {
        if (match.start >= lastEnd) {
            filteredMatches.push(match);
            lastEnd = match.end;
        }
    }
    
    // Build tokens array with text segments and types
    let currentPos = 0;
    
    for (const match of filteredMatches) {
        // Add any text before this match as plain text
        if (match.start > currentPos) {
            tokens.push({
                type: 'plain',
                text: code.substring(currentPos, match.start)
            });
        }
        
        // Add the matched token
        tokens.push({
            type: match.type,
            text: match.text
        });
        
        currentPos = match.end;
    }
    
    // Add any remaining text
    if (currentPos < code.length) {
        tokens.push({
            type: 'plain',
            text: code.substring(currentPos)
        });
    }
    
    return tokens;
}

// Apply theme colors to tokens
function getTokenColor(tokenType, theme) {
    const colorMap = {
        'keyword': theme.tokens.keyword,
        'string': theme.tokens.string,
        'number': theme.tokens.number,
        'comment': theme.tokens.comment,
        'function': theme.tokens.function,
        'class': theme.tokens.class,
        'type': theme.tokens.type,
        'variable': theme.tokens.variable,
        'operator': theme.tokens.operator,
        'punctuation': theme.tokens.punctuation,
        'namespace': theme.tokens.namespace,
        'attribute': theme.tokens.attribute,
        'property': theme.tokens.property,
        'constant': theme.tokens.constant,
        'escape': theme.tokens.escape,
        'plain': theme.foreground
    };
    
    return colorMap[tokenType] || theme.foreground;
}
