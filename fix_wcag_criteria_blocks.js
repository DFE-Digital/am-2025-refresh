const fs = require('fs');
const path = require('path');

const filePath = path.join(
    __dirname,
    'app/views/guidelines/wcag/explorer/index.html'
);
let content = fs.readFileSync(filePath, 'utf8');

// Regex to match all .dfe-wcag-criterion blocks (greedy, so we split them up)
const criterionRegex = /<div class="dfe-wcag-criterion"[\s\S]*?<\/div>/g;
let matches = [...content.matchAll(criterionRegex)];

let newContent = content;

matches.forEach(match => {
    const block = match[0];
    // Find all headings in this block
    const headingRegex =
        /(<div class="dfe-wcag-criterion-header">[\s\S]*?<\/div>\s*)?(<strong class="govuk-tag[\s\S]*?<\/strong>\s*)*(<h4 class="govuk-heading-s" id="([^"]+)">([\s\S]*?)<\/h4>)([\s\S]*?)(?=<div class="dfe-wcag-criterion-header"|<\/div>)/g;
    let submatches = [...block.matchAll(headingRegex)];
    // If only one heading, leave as is
    if (submatches.length <= 1) return;
    // Otherwise, split into separate blocks
    let rebuilt = '';
    submatches.forEach(sub => {
        // Compose a new .dfe-wcag-criterion block for each heading/content
        let tags = '';
        if (sub[2]) tags = sub[2];
        let header = sub[1] ? sub[1] : '';
        let h4 = sub[3];
        let id = sub[4];
        let title = sub[5];
        let rest = sub[6];
        // If no header, build one from tags and copy button
        if (!header) {
            header = `<div class="dfe-wcag-criterion-header">\n${tags}<button class="govuk-button govuk-button--secondary govuk-button--small copy-link-btn" data-target="${id}" aria-label="Copy link to criterion ${title}">Copy link</button>\n</div>`;
        }
        rebuilt += `<div class="dfe-wcag-criterion">\n${header}\n${h4}${rest}\n</div>\n`;
    });
    // Replace the original block with the rebuilt blocks
    newContent = newContent.replace(block, rebuilt);
});

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Refactored all .dfe-wcag-criterion blocks to be self-contained.');