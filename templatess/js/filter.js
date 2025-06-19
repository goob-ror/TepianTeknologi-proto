document.addEventListener('DOMContentLoaded', function() {
    // Get all filter headers
    const filterHeaders = document.querySelectorAll('.filter-header button');

    // Add click event listener to each header
    filterHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Get the parent filter-checkbox element
            const filterCheckbox = this.closest('.filter-checkbox');
            const filterOptions = filterCheckbox.querySelector('.filter-options');
            
            // Toggle active class
            filterCheckbox.classList.toggle('active');

            // Handle height transition
            if (filterCheckbox.classList.contains('active')) {
                filterOptions.style.height = filterOptions.scrollHeight + 'px';
            } else {
                filterOptions.style.height = '0';
            }

            // Close other dropdowns
            document.querySelectorAll('.filter-checkbox.active').forEach(activeFilter => {
                if (activeFilter !== filterCheckbox) {
                    activeFilter.classList.remove('active');
                    activeFilter.querySelector('.filter-options').style.height = '0';
                }
            });
        });
    });

    // Handle checkbox selections
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // If "All" checkbox is checked, uncheck others
            if (this.id.includes('all-')) {
                const category = this.name;
                if (this.checked) {
                    checkboxes.forEach(otherCheckbox => {
                        if (otherCheckbox.name === category && otherCheckbox !== this) {
                            otherCheckbox.checked = false;
                        }
                    });
                }
            } else {
                // If a specific checkbox is checked, uncheck "All"
                const category = this.name;
                const allCheckbox = document.querySelector(`#all-${category}`);
                if (allCheckbox) {
                    allCheckbox.checked = false;
                }
            }
        });
    });

    const priceFilterButton = document.querySelector('.filter-price-dropdown button');
    const priceFilterOptions = document.querySelector('.price-filter-options');
    const dropdownArrow = document.querySelector('.dropdown-button-arrow');
    let isOpen = false;

    // Add transition style to arrow
    dropdownArrow.style.transition = 'transform 0.3s ease';

    priceFilterButton.addEventListener('click', function() {
        isOpen = !isOpen;
        priceFilterOptions.style.display = isOpen ? 'block' : 'none';
        dropdownArrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!priceFilterButton.contains(e.target) && !priceFilterOptions.contains(e.target)) {
            isOpen = false;
            priceFilterOptions.style.display = 'none';
            dropdownArrow.style.transform = 'rotate(0deg)';
        }
    });
}); 