const fs = require('fs');
const path = require('path');

const filePath = path.join(
    __dirname,
    'app/views/guidelines/wcag/explorer/index.html'
);
let content = fs.readFileSync(filePath, 'utf8');

// Function to extract all tags from a criterion div
function extractTags(criterionContent) {
    const tagMatches = criterionContent.match(
        /<strong class="govuk-tag[^>]*>[^<]+<\/strong>/g
    );
    return tagMatches || [];
}

// Function to extract criterion ID and title
function extractCriterionInfo(criterionContent) {
    const h4Match = criterionContent.match(/<h4[^>]*id="([^"]+)"[^>]*>([^<]+)</);
    if (h4Match) {
        return {
            id: h4Match[1],
            title: h4Match[2].trim(),
        };
    }
    return null;
}

// Process each criterion div
content = content.replace(
    /<div class="dfe-wcag-criterion"[^>]*>([\s\S]*?)<\/div>/g,
    (match, criterionContent) => {
        // Extract tags and criterion info
        const tags = extractTags(criterionContent);
        const criterionInfo = extractCriterionInfo(criterionContent);

        if (!criterionInfo) return match;

        // Remove existing tags and header divs
        let cleanContent = criterionContent
            .replace(/<div class="dfe-wcag-criterion-header">[\s\S]*?<\/div>/g, '')
            .replace(/<strong class="govuk-tag[^>]*>[^<]+<\/strong>/g, '')
            .replace(/\n\s*\n/g, '\n'); // Clean up extra newlines

        // Create new header with tags and copy button
        const tagsHtml = tags.join('\n                                    ');
        const headerHtml = `
                                <div class="dfe-wcag-criterion-header">
                                    ${tagsHtml}
                                    <button class="govuk-button govuk-button--secondary govuk-button--small copy-link-btn" data-target="${criterionInfo.id}" aria-label="Copy link to criterion ${criterionInfo.title}">
                                        Copy link
                                    </button>
                                </div>`;

        return `<div class="dfe-wcag-criterion" data-level="a" data-themes="images">${headerHtml}${cleanContent}</div>`;
    }
);

// Add JavaScript for copy functionality if not already present
if (!content.includes('copy-link-btn')) {
    const copyScript = `
<script>
document.addEventListener('DOMContentLoaded', function() {
    const copyButtons = document.querySelectorAll('.copy-link-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const url = window.location.origin + window.location.pathname + '#' + targetId;
            
            navigator.clipboard.writeText(url).then(() => {
                // Show success state
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.classList.add('copy-link-btn--success');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copy-link-btn--success');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Show success state
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.classList.add('copy-link-btn--success');
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copy-link-btn--success');
                }, 2000);
            });
        });
    });
});
</script>`;

    content = content.replace('</body>', copyScript + '\n</body>');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed copy link buttons for all WCAG criteria.');