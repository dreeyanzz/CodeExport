// Application state
let currentTheme = 'palenight';
let currentFont = 'jetbrains-mono';
let currentLanguage = 'csharp';
let currentFontSize = 16;
let currentPadding = 60;
let showLineNumbers = true;

// DOM elements
const codeInput = document.getElementById('code-input');
const themeSelect = document.getElementById('theme-select');
const fontSelect = document.getElementById('font-select');
const languageSelect = document.getElementById('language-select');
const fontSizeInput = document.getElementById('font-size');
const paddingInput = document.getElementById('padding');
const showLineNumbersCheckbox = document.getElementById('show-line-numbers');
const filenameInput = document.getElementById('filename');
const generateBtn = document.getElementById('generate-btn');
const downloadPngBtn = document.getElementById('download-png-btn');
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const previewCanvas = document.getElementById('preview-canvas');

// Initialize the application
function init() {
    // Populate dropdowns
    populateThemeSelect();
    populateFontSelect();
    populateLanguageSelect();
    
    // Add event listeners
    generateBtn.addEventListener('click', generatePreview);
    downloadPngBtn.addEventListener('click', downloadPNG);
    downloadPdfBtn.addEventListener('click', downloadPDF);
    
    themeSelect.addEventListener('change', (e) => {
        currentTheme = e.target.value;
        updateEditorTheme();
    });
    
    fontSelect.addEventListener('change', (e) => {
        currentFont = e.target.value;
        loadFont(currentFont);
        updateEditorFont();
    });
    
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
    });
    
    fontSizeInput.addEventListener('change', (e) => {
        currentFontSize = parseInt(e.target.value);
    });
    
    paddingInput.addEventListener('change', (e) => {
        currentPadding = parseInt(e.target.value);
    });
    
    showLineNumbersCheckbox.addEventListener('change', (e) => {
        showLineNumbers = e.target.checked;
    });
    
    // Set initial values
    updateEditorTheme();
    updateEditorFont();
    
    // Add sample code
    codeInput.value = `namespace calculator
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();
            Application.Run(new Window());
        }
    }
}`;
}

// Populate theme dropdown
function populateThemeSelect() {
    const themes = getAllThemes();
    themeSelect.innerHTML = '';
    
    themes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.id;
        option.textContent = theme.name;
        themeSelect.appendChild(option);
    });
}

// Populate font dropdown
function populateFontSelect() {
    const fonts = getAllFonts();
    fontSelect.innerHTML = '';
    
    fonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font.id;
        option.textContent = font.name;
        fontSelect.appendChild(option);
    });
}

// Populate language dropdown
function populateLanguageSelect() {
    const languages = getAllLanguages();
    languageSelect.innerHTML = '';
    
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.id;
        option.textContent = lang.name;
        languageSelect.appendChild(option);
    });
}

// Update editor theme
function updateEditorTheme() {
    const theme = getTheme(currentTheme);
    codeInput.style.backgroundColor = theme.background;
    codeInput.style.color = theme.foreground;
}

// Update editor font
function updateEditorFont() {
    const font = getFont(currentFont);
    codeInput.style.fontFamily = font.family;
}

// Generate preview image
function generatePreview() {
    const code = codeInput.value;
    
    if (!code.trim()) {
        alert('Please enter some code first!');
        return;
    }
    
    const theme = getTheme(currentTheme);
    const font = getFont(currentFont);
    const tokens = tokenize(code, currentLanguage);
    
    // Create canvas context
    const ctx = previewCanvas.getContext('2d');
    
    // Set font for measurements
    ctx.font = `${currentFontSize}px ${font.family}`;
    
    // Calculate dimensions
    const lines = code.split('\n');
    const lineHeight = currentFontSize * font.lineHeight;
    
    // Calculate max line width first (without line numbers)
    const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
    
    // Calculate line number width (will be added to the left, expanding outward)
    const lineNumberWidth = showLineNumbers ? ctx.measureText(lines.length.toString()).width + 30 : 0;
    
    // Window header height
    const headerHeight = 50;
    
    // Calculate canvas dimensions with rounded corners and shadow
    // Line numbers expand outward (to the left), so they're added to the width
    const contentWidth = maxLineWidth + currentPadding + lineNumberWidth;
    const contentHeight = (lines.length * lineHeight) + currentPadding + headerHeight;
    
    // Add extra space for shadow and rounded corners
    const shadowBlur = 40;
    const shadowOffset = 20;
    const canvasWidth = contentWidth + shadowBlur * 2;
    const canvasHeight = contentHeight + shadowBlur + shadowOffset;
    
    // Set canvas size (with device pixel ratio for crisp rendering)
    const dpr = window.devicePixelRatio || 1;
    previewCanvas.width = canvasWidth * dpr;
    previewCanvas.height = canvasHeight * dpr;
    previewCanvas.style.width = canvasWidth + 'px';
    previewCanvas.style.height = canvasHeight + 'px';
    
    ctx.scale(dpr, dpr);
    
    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw shadow
    const rectX = shadowBlur;
    const rectY = shadowBlur;
    const rectWidth = contentWidth;
    const rectHeight = contentHeight;
    const cornerRadius = 12;
    
    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = shadowOffset;
    
    // Draw rounded rectangle for main container
    ctx.fillStyle = theme.background;
    ctx.beginPath();
    ctx.moveTo(rectX + cornerRadius, rectY);
    ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
    ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius);
    ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
    ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight);
    ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
    ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius);
    ctx.lineTo(rectX, rectY + cornerRadius);
    ctx.quadraticCurveTo(rectX, rectY, rectX + cornerRadius, rectY);
    ctx.closePath();
    ctx.fill();
    
    // Reset shadow for content
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Draw window control dots
    const dotY = rectY + 25;
    const dotRadius = 6;
    const dotSpacing = 20;
    const dotStartX = rectX + 25;
    
    // Red dot
    ctx.fillStyle = '#ff5f56';
    ctx.beginPath();
    ctx.arc(dotStartX, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Yellow dot
    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath();
    ctx.arc(dotStartX + dotSpacing, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Green dot
    ctx.fillStyle = '#27c93f';
    ctx.beginPath();
    ctx.arc(dotStartX + dotSpacing * 2, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw filename in the header (centered)
    const filename = filenameInput.value.trim() || 'Untitled';
    ctx.fillStyle = theme.foreground;
    ctx.font = `600 ${currentFontSize - 2}px ${font.family}`;
    ctx.textAlign = 'center';
    ctx.fillText(filename, rectX + rectWidth / 2, dotY - 5);
    ctx.textAlign = 'left'; // Reset to left align for code
    
    // Render code with syntax highlighting and line numbers
    ctx.font = `${currentFontSize}px ${font.family}`;
    ctx.textBaseline = 'top';
    
    let currentLine = 0;
    let currentLineIndex = 0;
    // Code starts after line numbers (which expand outward to the left)
    const codeStartX = rectX + lineNumberWidth + (currentPadding / 2);
    const startY = rectY + headerHeight + (currentPadding / 2);
    let currentX = codeStartX;
    let currentY = startY;
    
    // Track which line we're on for line numbers
    let lineNumbersDrawn = new Set();
    
    tokens.forEach(token => {
        const tokenLines = token.text.split('\n');
        
        tokenLines.forEach((line, index) => {
            if (index > 0) {
                // New line
                currentLine++;
                currentLineIndex++;
                currentX = codeStartX;
                currentY = startY + (currentLine * lineHeight);
            }
            
            // Draw line number (aligned to the right of the line number area)
            if (showLineNumbers && !lineNumbersDrawn.has(currentLineIndex)) {
                ctx.fillStyle = theme.tokens.comment;
                const lineNum = (currentLineIndex + 1).toString();
                const lineNumWidth = ctx.measureText(lineNum).width;
                // Right-align line numbers in their allocated space
                const lineNumX = rectX + lineNumberWidth - lineNumWidth - 15;
                ctx.fillText(lineNum, lineNumX, currentY);
                lineNumbersDrawn.add(currentLineIndex);
            }
            
            if (line) {
                ctx.fillStyle = getTokenColor(token.type, theme);
                ctx.fillText(line, currentX, currentY);
                currentX += ctx.measureText(line).width;
            }
        });
    });
    
    // Enable download buttons
    downloadPngBtn.disabled = false;
    downloadPdfBtn.disabled = false;
}

// Download image as PNG
function downloadPNG() {
    const dataURL = previewCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    const filename = filenameInput.value.trim() || 'code';
    link.download = `${filename}.png`;
    link.href = dataURL;
    link.click();
}

// Download image as PDF
function downloadPDF() {
    // Get canvas dimensions
    const canvasWidth = previewCanvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = previewCanvas.height / (window.devicePixelRatio || 1);
    
    // Convert pixels to points (72 points = 1 inch, typical screen is 96 DPI)
    const pxToPoint = 0.75;
    const pdfWidth = canvasWidth * pxToPoint;
    const pdfHeight = canvasHeight * pxToPoint;
    
    // Create a new jsPDF instance with custom dimensions
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [pdfWidth, pdfHeight]
    });
    
    // Convert canvas to image and add to PDF
    const imgData = previewCanvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Download the PDF
    const filename = filenameInput.value.trim() || 'code';
    pdf.save(`${filename}.pdf`);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', init);
