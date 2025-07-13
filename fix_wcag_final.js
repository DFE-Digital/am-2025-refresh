const fs = require('fs');
const path = require('path');

// Read the HTML file
const filePath = path.join(
    __dirname,
    'app/views/guidelines/wcag/explorer/index.html'
);
let content = fs.readFileSync(filePath, 'utf8');

// Define the mapping of criteria to their guidance sections
const criteriaMapping = {
    '1-1-1': '1.1',
    '1-2-x': '1.2',
    '1-3-1a': '1.3',
    '1-3-1b': '1.3',
    '1-3-1c': '1.3',
    '1-3-1d': '1.3',
    '1-3-1e': '1.3',
    '1-3-2': '1.3',
    '1-3-3': '1.3',
    '1-3-4': '1.3',
    '1-3-5': '1.3',
    '1-4-1': '1.4',
    '1-4-2': '1.4',
    '1-4-3': '1.4',
    '1-4-4': '1.4',
    '1-4-5': '1.4',
    '1-4-10': '1.4',
    '1-4-11': '1.4',
    '1-4-12': '1.4',
    '1-4-13': '1.4',
    '2-1-1': '2.1',
    '2-1-2': '2.1',
    '2-1-4': '2.1',
    '2-2-1': '2.2',
    '2-2-2': '2.2',
    '2-3-1': '2.3',
    '2-4-1': '2.4',
    '2-4-2': '2.4',
    '2-4-3': '2.4',
    '2-4-4': '2.4',
    '2-4-5': '2.4',
    '2-4-6': '2.4',
    '2-4-7': '2.4',
    '2-4-11': '2.4',
    '2-5-1': '2.5',
    '2-5-2': '2.5',
    '2-5-3': '2.5',
    '2-5-4': '2.5',
    '2-5-7': '2.5',
    '2-5-8': '2.5',
    '3-1-x': '3.1',
    '3-2-1': '3.2',
    '3-2-2': '3.2',
    '3-2-3': '3.2',
    '3-2-4': '3.2',
    '3-3-1': '3.3',
    '3-3-2': '3.3',
    '3-3-3': '3.3',
    '3-3-4': '3.3',
    '4-1-2': '4.1',
    '4-1-3': '4.1',
};

// Function to get guidance section name
function getGuidanceSection(criteriaId) {
    const section = criteriaMapping[criteriaId];
    if (!section) return '';

    const sectionNames = {
        1.1: 'Non-text Content',
        1.2: 'Time-based Media',
        1.3: 'Info and Relationships',
        1.4: 'Distinguishable',
        2.1: 'Keyboard Accessible',
        2.2: 'Enough Time',
        2.3: 'Seizures and Physical Reactions',
        2.4: 'Navigable',
        2.5: 'Input Modalities',
        3.1: 'Readable',
        3.2: 'Predictable',
        3.3: 'Input Assistance',
        4.1: 'Compatible',
    };

    return sectionNames[section] || section;
}

// First, remove all links from h4 headers
const h4LinkPattern =
    /<h4 class="govuk-heading-s" id="([^"]*)">\s*<a href="[^"]*">([^<]*)<\/a>\s*<\/h4>/g;

content = content.replace(h4LinkPattern, (match, id, linkText) => {
    return `<h4 class="govuk-heading-s" id="${id}">${linkText}</h4>`;
});

// Now add guidance links after the description paragraphs
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
            const criteriaId = h4Match[1];
            const guidanceSection = criteriaMapping[criteriaId];

            if (
                guidanceSection &&
                !criterionContent.includes('Related guidance: WCAG')
            ) {
                const guidanceName = getGuidanceSection(criteriaId);
                const guidanceLink = `<p><a href="/guidelines/wcag#${guidanceSection}">Related guidance: WCAG ${guidanceSection} ${guidanceName}</a></p>`;

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