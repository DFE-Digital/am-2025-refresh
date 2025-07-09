// MOJ Filter Component JavaScript

(function() {
    'use strict';

    function MoJFilter($module) {
        this.$module = $module;
        this.$header = $module.querySelector('.moj-filter__header');
        this.$content = $module.querySelector('.moj-filter__content');
        this.$selected = $module.querySelector('.moj-filter__selected');
        this.$options = $module.querySelector('.moj-filter__options');

        this.init();
    }

    MoJFilter.prototype.init = function() {
        // Initialize the filter component
        this.setupEventListeners();
    };

    MoJFilter.prototype.setupEventListeners = function() {
        // Accordion functionality
        document.querySelectorAll('.moj-filter__accordion-button').forEach(function(button) {
            button.addEventListener('click', function() {
                const expanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !expanded);
                const content = document.getElementById(button.getAttribute('aria-controls'));
                if (content) {
                    content.setAttribute('aria-hidden', expanded);
                }
            });
        });
    };

    // Initialize all filter components on the page
    function initAll() {
        var $modules = document.querySelectorAll('[data-module="moj-filter"]');
        $modules.forEach(function($module) {
            new MoJFilter($module);
        });
    }

    // Export for use
    window.MoJFilter = MoJFilter;

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();