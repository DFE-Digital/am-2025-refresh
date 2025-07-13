const fs = require('fs');
const path = require('path');

const filePath = path.join(
    __dirname,
    'app/views/guidelines/wcag/explorer/index.html'
);
let content = fs.readFileSync(filePath, 'utf8');

// Remove empty .dfe-wcag-criterion divs
content = content.replace(
    /<div class="dfe-wcag-criterion"[^>]*>\s*<\/div>\n?/g,
    ''
);

// Remove nested .dfe-wcag-criterion divs (flatten structure)
content = content.replace(
    /<div class="dfe-wcag-criterion"[^>]*>\s*<div class="dfe-wcag-criterion-header">/g,
    '<div class="dfe-wcag-criterion-header">'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Cleaned up empty and nested .dfe-wcag-criterion divs.');