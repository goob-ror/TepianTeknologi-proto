document.addEventListener('DOMContentLoaded', function() {
    const productsPerPage = 5;
    const productsContainer = document.querySelector('.track-products');
    const allProducts = Array.from(productsContainer.children);
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    const paginationContainer = document.querySelector('.related-pagination');
    
    // Create pagination buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = 'page-btn';
        if (i === 1) pageButton.classList.add('active');
        paginationContainer.appendChild(pageButton);
    }
    
    // Add pagination styles
    const style = document.createElement('style');
    style.textContent = `
        .related-pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 30px;
        }
        
        .related-pagination .page-btn {
            padding: 8px 16px;
            border: 2px solid var(--primary-color);
            background: transparent;
            color: var(--primary-color);
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .related-pagination .page-btn:hover {
            background: var(--primary-color);
            color: white;
        }
        
        .related-pagination .page-btn.active {
            background: var(--primary-color);
            color: white;
        }
    `;
    document.head.appendChild(style);
    
    // Function to show products for a specific page
    function showPage(pageNumber) {
        const start = (pageNumber - 1) * productsPerPage;
        const end = start + productsPerPage;
        
        // Show/hide products
        allProducts.forEach((product, index) => {
            if (index >= start && index < end) {
                product.style.display = 'flex';
            } else {
                product.style.display = 'none';
            }
        });
        
        // Update active button
        document.querySelectorAll('.related-pagination .page-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent == pageNumber) {
                btn.classList.add('active');
            }
        });
    }
    
    // Add click event to pagination buttons
    document.querySelectorAll('.related-pagination .page-btn').forEach(button => {
        button.addEventListener('click', () => {
            showPage(button.textContent);
        });
    });
    
    // Show first page initially
    showPage(1);
}); 