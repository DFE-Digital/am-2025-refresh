const fs = require('fs');
const path = require('path');

const filePath = path.join(
    __dirname,
    'app/views/guidelines/wcag/explorer/index.html'
);
let content = fs.readFileSync(filePath, 'utf8');

// Regex to match each .dfe-wcag-criterion block
const criterionRegex = /<div class="dfe-wcag-criterion"[\s\S]*?<\/div>/g;

content = content.replace(criterionRegex, block => {
    // Extract all tags and the h4 heading
    const tags = [
            ...block.matchAll(/<strong class="govuk-tag[\s\S]*?<\/strong>/g),
        ]
        .map(m => m[0])
        .join('\n');
    const h4Match = block.match(/<h4[^>]*>[\s\S]*?<\/h4>/);
    const h4 = h4Match ? h4Match[0] : '';
    // Remove tags and h4 from the block
    let rest = block
        .replace(/<strong class="govuk-tag[\s\S]*?<\/strong>/g, '')
        .replace(/<h4[^>]*>[\s\S]*?<\/h4>/, '')
        .replace(/<div class="dfe-wcag-criterion-header">[\s\S]*?<\/div>/, '');
    // Find the copy button
    const btnMatch = block.match(
        /<button class="govuk-button[\s\S]*?copy-link-btn[\s\S]*?<\/button>/
    );
    const btn = btnMatch ? btnMatch[0] : '';
    // Build new header
    const header = `<div class="dfe-wcag-criterion-header">\n${tags}\n${h4}\n${btn}\n</div>`;
    // Rebuild the block
    return `<div class="dfe-wcag-criterion">\n${header}\n${rest}\n</div>`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Moved all tags and heading into the header for each criterion.');