document.addEventListener('DOMContentLoaded', function() {
    // Get all quantity controls
    const quantityControls = document.querySelectorAll('.size-add');
    const totalItemsElement = document.querySelector('.total-items');
    const totalPriceElement = document.querySelector('.total-price');
    
    // Function to update order summary
    function updateOrderSummary() {
        let totalItems = 0;
        let totalPrice = 0;
        
        quantityControls.forEach(control => {
            const input = control.querySelector('input[type="number"]');
            const productCard = control.closest('.keranjang-product');
            const priceElement = productCard.querySelector('.keranjang-product-details p');
            
            const quantity = parseInt(input.value);
            const price = parseInt(priceElement.textContent.replace('Rp. ', '').replace('.', ''));
            
            totalItems += quantity;
            totalPrice += price * quantity;
        });
        
        totalItemsElement.textContent = totalItems;
        totalPriceElement.textContent = `Rp. ${totalPrice.toLocaleString('id-ID')}`;
    }
    
    quantityControls.forEach(control => {
        const minusBtn = control.querySelector('button:first-child');
        const plusBtn = control.querySelector('button:last-child');
        const input = control.querySelector('input[type="number"]');
        
        // Set initial value
        input.value = 1;
        
        // Function to update total price
        function updateTotal(quantity) {
            const productCard = control.closest('.keranjang-product');
            const priceElement = productCard.querySelector('.keranjang-product-details p');
            const totalElement = productCard.querySelector('.keranjang-product-details h2 span');
            
            // Get price from the price element (remove 'Rp. ' and convert to number)
            const price = parseInt(priceElement.textContent.replace('Rp. ', '').replace('.', ''));
            
            // Calculate and update total
            const total = price * quantity;
            totalElement.textContent = `Rp. ${total.toLocaleString('id-ID')}`;
            
            // Update order summary
            updateOrderSummary();
        }
        
        // Minus button click handler
        minusBtn.addEventListener('click', () => {
            let value = parseInt(input.value);
            if (value > 0) {
                value--;
                input.value = value;
                updateTotal(value);
            }
        });
        
        // Plus button click handler
        plusBtn.addEventListener('click', () => {
            let value = parseInt(input.value);
            value++;
            input.value = value;
            updateTotal(value);
        });
        
        // Input change handler
        input.addEventListener('change', () => {
            let value = parseInt(input.value);
            if (isNaN(value) || value < 0) {
                value = 0;
                input.value = value;
            }
            updateTotal(value);
        });
        
        // Initialize total price
        updateTotal(1);
    });
    
    // Initialize order summary
    updateOrderSummary();
}); 