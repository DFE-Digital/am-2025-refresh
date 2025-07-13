const fs = require('fs');
const path = require('path');

// Read the HTML file
const filePath = path.join(
    __dirname,
    'app/views/guidelines/wcag/explorer/index.html'
);
let content = fs.readFileSync(filePath, 'utf8');

// Function to extract criteria number and name from the link text
function extractCriteriaInfo(linkText) {
    // Remove "Related guidance: WCAG " prefix if present
    let cleanText = linkText.replace(/^Related guidance: WCAG\s+/, '');

    const match = cleanText.match(/(\d+\.\d+(?:[a-z])?)\s*-\s*(.+)/);
    if (match) {
        return {
            number: match[1],
            name: match[2].trim(),
        };
    }
    return null;
}

// Function to generate the related guidance link
function generateGuidanceLink(criteriaInfo) {
    if (!criteriaInfo) return '';

    // Extract the main section number (e.g., "1.3" from "1.3.1a")
    const parts = criteriaInfo.number.split('.');
    const mainSection = parts[0] + '.' + parts[1];

    return `<p><a href="/guidelines/wcag#${mainSection}">Related guidance: WCAG ${mainSection}</a></p>`;
}

// First, let's fix the h4 headers that still have "Related guidance" text
const h4FixPattern =
    /<h4 class="govuk-heading-s" id="([^"]*)">Related guidance: WCAG ([^<]*)<\/h4>/g;

content = content.replace(h4FixPattern, (match, id, criteriaText) => {
    const criteriaInfo = extractCriteriaInfo(criteriaText);
    if (criteriaInfo) {
        return `<h4 class="govuk-heading-s" id="${id}">${criteriaInfo.number} - ${criteriaInfo.name}</h4>`;
    }
    return match;
});

// Now let's add the guidance links after the description paragraphs
// We need to find each criterion and add the guidance link after the first paragraph

const criterionPattern =
    /(<div class="dfe-wcag-criterion"[^>]*>)([\s\S]*?)(<\/div>\s*<\/div>)/g;

content = content.replace(
    criterionPattern,
    (match, startDiv, criterionContent, endDivs) => {
        // Find the h4 element to get the criteria info
        const h4Match = criterionContent.match(
            /<h4 class="govuk-heading-s" id="([^"]*)">([^<]*)<\/h4>/
        );
        if (h4Match) {
            const criteriaInfo = extractCriteriaInfo(h4Match[2]);
            const guidanceLink = generateGuidanceLink(criteriaInfo);

            // Check if guidance link already exists
            if (
                guidanceLink &&
                !criterionContent.includes('Related guidance: WCAG')
            ) {
                // Find the first paragraph after the h4 and insert the guidance link after it
                const firstParagraphPattern =
                    /(<h4[^>]*>[\s\S]*?<\/h4>)([\s\S]*?)(<p[^>]*>.*?<\/p>)/;
                const paragraphMatch = criterionContent.match(firstParagraphPattern);

                if (paragraphMatch) {
                    const beforeParagraph = paragraphMatch[1] + paragraphMatch[2];
                    const paragraph = paragraphMatch[3];
                    const afterParagraph = criterionContent.substring(
                        paragraphMatch.index + paragraphMatch[0].length
                    );

                    return (
                        startDiv +
                        beforeParagraph +
                        paragraph +
                        guidanceLink +
                        afterParagraph +
                        endDivs
                    );
                }
            }
        }

        return match;
    }
);

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('WCAG criteria links have been updated successfully!');