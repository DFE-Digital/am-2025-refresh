// Services navigation functionality
const servicesTab = document.getElementById("services-tab");
const servicesPanel = document.getElementById("services-panel");
const closeNav = document.getElementById("close-nav");

if (servicesTab && servicesPanel && closeNav) {
    servicesTab.addEventListener("click", function(e) {
        e.preventDefault();
        if (servicesPanel.style.display === "none") {
            servicesPanel.style.display = "block";
            servicesPanel.setAttribute("aria-hidden", "false");
            servicesTab.setAttribute("aria-expanded", "true");
        } else {
            servicesPanel.style.display = "none";
            servicesPanel.setAttribute("aria-hidden", "true");
            servicesTab.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" || e.key === "Esc") {
            e.preventDefault();
            if (servicesPanel.style.display === "block") {
                servicesPanel.style.display = "none";
                servicesPanel.setAttribute("aria-hidden", "true");
                servicesTab.setAttribute("aria-expanded", "false");
            }
        }
    });

    closeNav.addEventListener("click", function(e) {
        e.preventDefault();
        servicesPanel.style.display = "none";
        servicesPanel.setAttribute("aria-hidden", "true");
        servicesTab.setAttribute("aria-expanded", "false");
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('App.js loaded');

    // Copy button functionality
    const copyButtons = document.querySelectorAll(".copy-btn");

    copyButtons.forEach(button => {
        button.addEventListener("click", function() {
            const targetId = this.getAttribute("data-copy-target");
            const codeElement = document.getElementById(targetId);
            const textToCopy = codeElement.innerText;

            navigator
                .clipboard
                .writeText(textToCopy)
                .then(() => {
                    this.textContent = "Copied!";
                    setTimeout(() => {
                        this.textContent = "Copy code";
                    }, 2000);
                })
                .catch(err => {
                    console.error("Failed to copy text: ", err);
                });
        });
    });

    // Enhanced Copy share link functionality
    const copyShareLinkButton = document.getElementById("copy-share-link");
    if (copyShareLinkButton) {
        copyShareLinkButton.addEventListener("click", function() {
            const linkToCopy = this.getAttribute("data-clipboard-text");
            const statusElement = document.getElementById("copy-status");
            const originalText = this.textContent;
            const originalClasses = this.className;

            // Disable button during copy operation
            this.disabled = true;
            this.style.pointerEvents = 'none';

            navigator.clipboard.writeText(linkToCopy)
                .then(() => {
                    // Success state
                    this.classList.remove('dfe-copy-button--error');
                    this.classList.add('dfe-copy-button--success');

                    // Update button text
                    this.textContent = "Copied link to clipboard";

                    // Announce success to screen readers
                    if (statusElement) {
                        statusElement.textContent = "Share link successfully copied to clipboard";
                        statusElement.className = "govuk-visually-hidden";
                        statusElement.setAttribute("role", "status");
                        statusElement.setAttribute("aria-live", "polite");
                    }

                    // Re-enable button and reset after 3 seconds
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.className = originalClasses;
                        this.disabled = false;
                        this.style.pointerEvents = 'auto';

                        if (statusElement) {
                            statusElement.textContent = "";
                        }
                    }, 3000);
                })
                .catch(err => {
                    console.error("Failed to copy link: ", err);

                    // Error state
                    this.classList.remove('dfe-copy-button--success');
                    this.classList.add('dfe-copy-button--error');

                    // Update button text
                    this.textContent = "Copy failed";

                    // Announce error to screen readers
                    if (statusElement) {
                        statusElement.textContent = "Failed to copy share link to clipboard. Please try again.";
                        statusElement.className = "govuk-visually-hidden";
                        statusElement.setAttribute("role", "status");
                        statusElement.setAttribute("aria-live", "polite");
                    }

                    // Re-enable button and reset after 4 seconds
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.className = originalClasses;
                        this.disabled = false;
                        this.style.pointerEvents = 'auto';

                        if (statusElement) {
                            statusElement.textContent = "";
                        }
                    }, 4000);
                });
        });

        // Add keyboard support for Enter and Space keys
        copyShareLinkButton.addEventListener("keydown", function(e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Simple test to see if script is running
    if (document.getElementById('wcag-filter-form')) {
        console.log('WCAG filter form found!');
        alert('WCAG filter form found - JavaScript is working!');
    } else {
        console.log('WCAG filter form NOT found');
    }

    // WCAG Explorer Filter System - Updated for MOJ Filter with Apply Button
    const wcagFilterForm = document.getElementById('wcag-filter-form');
    if (wcagFilterForm) {
        const filterCheckboxes = wcagFilterForm.querySelectorAll('input[type="checkbox"]');
        const clearFiltersButton = document.getElementById('clear-filters');
        const applyFiltersButton = document.getElementById('apply-filters');
        const criteriaCountElement = document.getElementById('criteria-count');
        const criteriaElements = document.querySelectorAll('.dfe-wcag-criterion');

        // Initialize count
        updateCriteriaCount();

        // Filter functionality
        function applyFilters() {
            const selectedThemes = Array.from(filterCheckboxes)
                .filter(checkbox => checkbox.checked && checkbox.name.startsWith('filter-') && !checkbox.name.includes('level-'))
                .map(checkbox => checkbox.value);

            const selectedLevels = Array.from(filterCheckboxes)
                .filter(checkbox => checkbox.checked && checkbox.name.includes('level-'))
                .map(checkbox => checkbox.value);

            criteriaElements.forEach(criterion => {
                const criterionThemes = criterion.dataset.themes ? criterion.dataset.themes.split(' ') : [];
                const criterionLevel = criterion.dataset.level;

                const themeMatch = selectedThemes.length === 0 ||
                    selectedThemes.some(theme => criterionThemes.includes(theme));
                const levelMatch = selectedLevels.length === 0 ||
                    selectedLevels.includes(criterionLevel);

                if (themeMatch && levelMatch) {
                    criterion.classList.remove('hidden');
                } else {
                    criterion.classList.add('hidden');
                }
            });

            // Hide empty sections
            document.querySelectorAll('.dfe-wcag-criteria-section').forEach(section => {
                const visibleCriteria = section.querySelectorAll('.dfe-wcag-criterion:not(.hidden)');
                if (visibleCriteria.length === 0) {
                    section.classList.add('hidden');
                } else {
                    section.classList.remove('hidden');
                }
            });

            updateCriteriaCount();
        }

        function updateCriteriaCount() {
            const visibleCriteria = document.querySelectorAll('.dfe-wcag-criterion:not(.hidden)');
            if (criteriaCountElement) {
                criteriaCountElement.textContent = visibleCriteria.length;
            }
        }

        function clearAllFilters() {
            filterCheckboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
            applyFilters();
        }

        // Event listeners
        if (applyFiltersButton) {
            applyFiltersButton.addEventListener('click', function(e) {
                e.preventDefault();
                applyFilters();
            });
        }

        if (clearFiltersButton) {
            clearFiltersButton.addEventListener('click', function(e) {
                e.preventDefault();
                clearAllFilters();
            });
        }

        // Initialize filters (show all by default)
        applyFilters();
    }
});