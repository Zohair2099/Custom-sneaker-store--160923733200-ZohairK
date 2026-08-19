// ===========================================
// Payment Module for SneakerHub
// ===========================================

// Initialize payment page
document.addEventListener('DOMContentLoaded', function() {
    initPaymentPage();
});

// Initialize payment page
function initPaymentPage() {
    loadCart();

    if (cart.length === 0) {
        showEmptyCart();
    } else {
        renderOrderSummary();
        setupFormValidation();
        setupPaymentMethodToggle();
    }
}

// Show empty cart message
function showEmptyCart() {
    document.getElementById('empty-cart-message').style.display = 'flex';
    document.getElementById('payment-content').style.display = 'none';
}

// Render order summary
function renderOrderSummary() {
    const summaryItems = document.getElementById('summary-items');
    const itemCount = document.getElementById('item-count');

    // Calculate totals
    const subtotal = getCartSubtotal();
    const shipping = getShippingCost();
    const tax = getTaxAmount();
    const total = getGrandTotal();

    // Render items
    summaryItems.innerHTML = cart.map(item => {
        const product = getProductById(item.productId);
        if (!product) return '';

        return `
            <div class="summary-item">
                <img src="${product.image}" alt="${product.name}" class="summary-item-image">
                <div class="summary-item-details">
                    <h4>${product.name}</h4>
                    <p>Size: ${item.size} | Qty: ${item.quantity}</p>
                </div>
                <div class="summary-item-price">
                    $${(product.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `;
    }).join('');

    // Update item count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    itemCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

    // Update totals
    document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summary-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('summary-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
}

// Get shipping cost (free over $100)
function getShippingCost() {
    const subtotal = getCartSubtotal();
    return subtotal >= 100 ? 0 : 9.99;
}

// Get tax amount (8% tax)
function getTaxAmount() {
    return getCartSubtotal() * 0.08;
}

// Get grand total
function getGrandTotal() {
    return getCartSubtotal() + getShippingCost() + getTaxAmount();
}

// Setup payment method toggle
function setupPaymentMethodToggle() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const upiDetails = document.getElementById('upi-details');
    const cardDetails = document.getElementById('card-details');

    paymentMethods.forEach(method => {
        const radio = method.querySelector('input[type="radio"]');
        radio.addEventListener('change', function() {
            // Hide all details sections
            upiDetails.style.display = 'none';
            cardDetails.style.display = 'none';

            // Show selected method's details
            if (this.value === 'upi') {
                upiDetails.style.display = 'block';
            } else if (this.value === 'card') {
                cardDetails.style.display = 'block';
            }
        });
    });
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('payment-form');
    const inputs = form.querySelectorAll('input, textarea');

    // Add input event listeners for real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Format specific fields
            if (input.id === 'phone') {
                input.value = input.value.replace(/\D/g, '').substring(0, 10);
            } else if (input.id === 'card-number') {
                input.value = input.value.replace(/\D/g, '').substring(0, 16);
            } else if (input.id === 'expiry-date') {
                input.value = input.value.replace(/\D/g, '').substring(0, 4);
                if (input.value.length >= 2 && !input.value.includes('/')) {
                    input.value = input.value.substring(0, 2) + '/' + input.value.substring(2);
                }
            } else if (input.id === 'cvv') {
                input.value = input.value.replace(/\D/g, '').substring(0, 4);
            }

            // Validate field
            validateField(input);
        });

        // Validate on blur
        input.addEventListener('blur', function() {
            validateField(input);
        });

        // Clear error on focus
        input.addEventListener('focus', function() {
            clearError(input);
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all required fields based on selected payment method
        if (!validateForm()) {
            showNotification('Please fix the errors in the form', 'error');
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Process payment based on selected method
        processPayment();
    });
}

// Validate individual field
function validateField(input) {
    const value = input.value.trim();
    const id = input.id;
    let errorMessage = '';

    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cod';

    // Validation rules
    switch (id) {
        case 'full-name':
            if (!value) {
                errorMessage = 'Full name is required';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                errorMessage = 'Name should contain only letters and spaces';
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
            }
            break;

        case 'phone':
            if (!value) {
                errorMessage = 'Phone number is required';
            } else if (!/^\d{10}$/.test(value)) {
                errorMessage = 'Phone number must be 10 digits';
            }
            break;

        case 'address':
            if (!value) {
                errorMessage = 'Address is required';
            } else if (value.length < 10) {
                errorMessage = 'Please enter a complete address';
            }
            break;

        case 'upi-id':
            // Only validate if UPI method selected
            if (paymentMethod === 'upi') {
                if (!value) {
                    errorMessage = 'UPI ID is required';
                } else if (!/^[\w.-]+@[\w.-]+$/.test(value)) {
                    errorMessage = 'Please enter a valid UPI ID (e.g., name@upi)';
                }
            }
            break;

        case 'cardholder-name':
            // Only validate if Card method selected
            if (paymentMethod === 'card') {
                if (!value) {
                    errorMessage = 'Cardholder name is required';
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    errorMessage = 'Name should contain only letters and spaces';
                }
            }
            break;

        case 'card-number':
            // Only validate if Card method selected
            if (paymentMethod === 'card') {
                if (!value) {
                    errorMessage = 'Card number is required';
                } else if (!/^\d{16}$/.test(value.replace(/\s/g, ''))) {
                    errorMessage = 'Card number must be 16 digits';
                } else if (!luhnCheck(value.replace(/\s/g, ''))) {
                    errorMessage = 'Invalid card number';
                }
            }
            break;

        case 'expiry-date':
            // Only validate if Card method selected
            if (paymentMethod === 'card') {
                if (!value) {
                    errorMessage = 'Expiry date is required';
                } else if (!/^\d{2}\/\d{2}$/.test(value)) {
                    errorMessage = 'Use MM/YY format';
                } else {
                    const month = parseInt(value.substring(0, 2));
                    const year = parseInt('20' + value.substring(3, 2));
                    const now = new Date();
                    const currentYear = now.getFullYear();
                    const currentMonth = now.getMonth() + 1;
                    if (month < 1 || month > 12) {
                        errorMessage = 'Invalid month (01-12)';
                    } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
                        errorMessage = 'Card has expired';
                    }
                }
            }
            break;

        case 'cvv':
            // Only validate if Card method selected
            if (paymentMethod === 'card') {
                if (!value) {
                    errorMessage = 'CVV is required';
                } else if (!/^\d{3,4}$/.test(value)) {
                    errorMessage = 'CVV must be 3 or 4 digits';
                }
            }
            break;
    }

    // Show or clear error
    if (errorMessage) {
        showError(input, errorMessage);
        return false;
    } else {
        clearError(input);
        return true;
    }
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('payment-form');
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    // Always required: full-name, phone, address
    const alwaysRequired = ['full-name', 'phone', 'address'];
    alwaysRequired.forEach(id => {
        const input = document.getElementById(id);
        if (input && !validateField(input)) {
            isValid = false;
        }
    });

    // Payment method specific validation
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cod';

    if (paymentMethod === 'upi') {
        const upiId = document.getElementById('upi-id');
        if (upiId && !validateField(upiId)) {
            isValid = false;
        }
    } else if (paymentMethod === 'card') {
        const cardFields = ['cardholder-name', 'card-number', 'expiry-date', 'cvv'];
        cardFields.forEach(id => {
            const input = document.getElementById(id);
            if (input && !validateField(input)) {
                isValid = false;
            }
        });
    }

    return isValid;
}

// Show error message
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    formGroup.classList.add('error');
    input.classList.add('error');
    const errorEl = formGroup.querySelector('.error-message');
    if (errorEl) errorEl.textContent = message;
}

// Clear error message
function clearError(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    formGroup.classList.remove('error');
    input.classList.remove('error');
    const errorEl = formGroup.querySelector('.error-message');
    if (errorEl) errorEl.textContent = '';
}

// Luhn algorithm for card validation
function luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
    }
    return sum % 10 === 0;
}

// Process payment
function processPayment() {
    const submitBtn = document.getElementById('submit-btn');
    const submitBtnText = document.getElementById('submit-btn-text');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cod';

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <div class="spinner"></div>
        <span>Processing...</span>
    `;

    // Simulate payment processing
    setTimeout(() => {
        // Clear cart
        clearCart();

        // Prepare order data
        const now = new Date();
        const deliveryDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 business days default
        const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const fullName = document.getElementById('full-name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const email = document.getElementById('email')?.value || '';

        const subtotal = getCartSubtotal();
        const shipping = getShippingCost();
        const tax = getTaxAmount();
        const total = subtotal + shipping + tax;

        const orderId = generateOrderId();

        const orderData = {
            orderId: orderId,
            fullName: fullName,
            phone: phone,
            address: address,
            email: email,
            paymentMethod: paymentMethod.toUpperCase(),
            deliveryDays: 5,
            deliveryDate: deliveryDateStr,
            total: total
        };

        // Store order data for confirmation page
        localStorage.setItem('lastOrder', JSON.stringify(orderData));

        // Redirect to order confirmation page
        window.location.href = 'order-confirmation.html';
    }, 1500);
}

// Generate order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SH-${timestamp}-${random}`;
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}