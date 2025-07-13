const fs = require('fs');
const path = require('path');

const filePath = path.join(
    __dirname,
    'app/views/guidelines/wcag/explorer/index.html'
);
let content = fs.readFileSync(filePath, 'utf8');

// Function to extract criterion ID and title from h4
function extractCriterionInfo(h4Content) {
    const match = h4Content.match(/id="([^"]+)"[^>]*>([^<]+)</);
    if (match) {
        return {
            id: match[1],
            title: match[2].trim(),
        };
    }
    return null;
}

// Add copy link buttons to all criteria
content = content.replace(
    /(<div class="dfe-wcag-criterion"[^>]*>)(\s*)(<strong[^>]*>.*?<\/strong>)/g,
    (match, divStart, whitespace, tags) => {
        // Find the h4 that follows to get the criterion info
        const afterMatch = content.substring(content.indexOf(match) + match.length);
        const h4Match = afterMatch.match(/<h4[^>]*id="([^"]+)"[^>]*>([^<]+)</);

        if (h4Match) {
            const id = h4Match[1];
            const title = h4Match[2].trim();
            const button = `\n                                <div class="dfe-wcag-criterion-header">\n                                    ${tags}\n                                    <button class="govuk-button govuk-button--secondary govuk-button--small copy-link-btn" data-target="${id}" aria-label="Copy link to criterion ${title}">\n                                        Copy link\n                                    </button>\n                                </div>`;
            return divStart + button;
        }

        return match;
    }
);

// Add JavaScript for copy functionality
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
</script>
`;

// Add the script before the closing body tag
content = content.replace('</body>', copyScript + '\n</body>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Added copy link buttons to all WCAG criteria.');