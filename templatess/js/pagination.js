document.addEventListener('DOMContentLoaded', function() {
    const productsPerPage = 8;
    const productsContainer = document.querySelector('.katalog-products');
    const allProducts = Array.from(productsContainer.children);
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    
    // Create pagination container
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';
    
    // Create pagination buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = 'page-btn';
        if (i === 1) pageButton.classList.add('active');
        paginationContainer.appendChild(pageButton);
    }
    
    // Insert pagination after products
    productsContainer.parentNode.insertBefore(paginationContainer, productsContainer.nextSibling);
    
    // Add pagination styles
    const style = document.createElement('style');
    style.textContent = `
        .pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 30px;
        }
        
        .page-btn {
            padding: 8px 16px;
            border: 2px solid var(--primary-color);
            background: transparent;
            color: var(--primary-color);
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .page-btn:hover {
            background: var(--primary-color);
            color: white;
        }
        
        .page-btn.active {
            background: var(--primary-color);
            color: white;
        }
        
        .products {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .products.fade-out {
            opacity: 0;
            transform: translateY(20px);
        }
        
        .products.fade-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Function to show products for a specific page
    function showPage(pageNumber) {
        const start = (pageNumber - 1) * productsPerPage;
        const end = start + productsPerPage;
        
        // Fade out current products
        allProducts.forEach(product => {
            product.classList.add('fade-out');
        });
        
        // After fade out, update visibility and fade in
        setTimeout(() => {
            allProducts.forEach((product, index) => {
                if (index >= start && index < end) {
                    product.style.display = 'flex';
                    setTimeout(() => {
                        product.classList.remove('fade-out');
                        product.classList.add('fade-in');
                    }, 50);
                } else {
                    product.style.display = 'none';
                    product.classList.remove('fade-in');
                }
            });
        }, 300);
        
        // Update active button
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent == pageNumber) {
                btn.classList.add('active');
            }
        });
    }
    
    // Add click event to pagination buttons
    document.querySelectorAll('.page-btn').forEach(button => {
        button.addEventListener('click', () => {
            showPage(button.textContent);
        });
    });
    
    // Show first page initially
    showPage(1);
}); 