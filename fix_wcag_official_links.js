const fs = require('fs');
const path = require('path');

const filePath = path.join(
    __dirname,
    'app/views/guidelines/wcag/explorer/index.html'
);
let content = fs.readFileSync(filePath, 'utf8');

// Remove duplicate WCAG links that do not have the govuk-link class
content = content.replace(
    /<p><a href="https:\/\/www\.w3\.org\/WAI\/WCAG22\/Understanding\/[^"]+" rel="noopener noreferrer">[^<]+<\/a><\/p>\n?/g,
    ''
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Removed duplicate WCAG links without govuk-link class.');