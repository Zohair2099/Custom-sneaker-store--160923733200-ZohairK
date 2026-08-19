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

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('payment-form');
    const inputs = form.querySelectorAll('input');
    const methodRadios = form.querySelectorAll('input[name="paymentMethod"]');
    const cardSection = document.getElementById('payment-details-section');
    const codSection = document.getElementById('cod-info-section');

    // Toggle payment details based on selected method
    function togglePaymentMethod() {
        const method = form.querySelector('input[name="paymentMethod"]:checked').value;
        if (method === 'cod') {
            cardSection.style.display = 'none';
            codSection.style.display = 'block';
            // Clear any card errors
            ['cardholder', 'card-number', 'expiry', 'cvv'].forEach(id => {
                const el = document.getElementById(id);
                if (el) clearError(el);
            });
        } else {
            cardSection.style.display = 'block';
            codSection.style.display = 'none';
        }
    }

    methodRadios.forEach(radio => {
        radio.addEventListener('change', togglePaymentMethod);
    });

    // Add input event listeners for real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Skip card formatting when COD is selected
            const method = form.querySelector('input[name="paymentMethod"]:checked').value;
            if (method === 'cod' && ['cardholder', 'card-number', 'expiry', 'cvv'].includes(input.id)) {
                return;
            }

            // Format specific fields
            if (input.id === 'card-number') {
                formatCardNumber(input);
            } else if (input.id === 'expiry') {
                formatExpiryDate(input);
            } else if (input.id === 'cvv') {
                input.value = input.value.replace(/\D/g, '').substring(0, 4);
            } else if (input.id === 'phone') {
                input.value = input.value.replace(/\D/g, '').substring(0, 10);
            } else if (input.id === 'postal') {
                input.value = input.value.replace(/[^0-9a-zA-Z]/g, '').substring(0, 6);
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

        const method = form.querySelector('input[name="paymentMethod"]:checked').value;

        // Validate all fields except card fields when COD is selected
        let isValid = true;
        inputs.forEach(input => {
            if (method === 'cod' && ['cardholder', 'card-number', 'expiry', 'cvv'].includes(input.id)) {
                clearError(input);
                return;
            }
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showNotification('Please fix the errors in the form', 'error');
            // Scroll to first error
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Process payment
        processPayment(method);
    });
}

// Validate individual field
function validateField(input) {
    const value = input.value.trim();
    const id = input.id;
    let errorMessage = '';

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

        case 'email':
            if (!value) {
                errorMessage = 'Email address is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'phone':
            if (!value) {
                errorMessage = 'Phone number is required';
            } else if (value.length < 10) {
                errorMessage = 'Phone number must be 10 digits';
            }
            break;

        case 'address':
            if (!value) {
                errorMessage = 'Street address is required';
            } else if (value.length < 5) {
                errorMessage = 'Please enter a complete address';
            }
            break;

        case 'city':
            if (!value) {
                errorMessage = 'City is required';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                errorMessage = 'City should contain only letters';
            }
            break;

        case 'postal':
            if (!value) {
                errorMessage = 'Postal code is required';
            } else if (value.length < 5) {
                errorMessage = 'Postal code must be at least 5 characters';
            }
            break;

        case 'cardholder':
            if (!value) {
                errorMessage = 'Cardholder name is required';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                errorMessage = 'Name should contain only letters and spaces';
            }
            break;

        case 'card-number':
            const cardNumber = value.replace(/\s/g, '');
            if (!cardNumber) {
                errorMessage = 'Card number is required';
            } else if (cardNumber.length < 16) {
                errorMessage = 'Card number must be 16 digits';
            } else if (!luhnCheck(cardNumber)) {
                errorMessage = 'Invalid card number';
            }
            break;

        case 'expiry':
            if (!value) {
                errorMessage = 'Expiry date is required';
            } else if (!/^\d{2}\/\d{2}$/.test(value)) {
                errorMessage = 'Use MM/YY format';
            } else {
                const [month, year] = value.split('/').map(Number);
                if (month < 1 || month > 12) {
                    errorMessage = 'Invalid month (01-12)';
                } else {
                    const now = new Date();
                    const currentYear = now.getFullYear() % 100;
                    const currentMonth = now.getMonth() + 1;
                    if (year < currentYear || (year === currentYear && month < currentMonth)) {
                        errorMessage = 'Card has expired';
                    }
                }
            }
            break;

        case 'cvv':
            if (!value) {
                errorMessage = 'CVV is required';
            } else if (value.length < 3) {
                errorMessage = 'CVV must be 3 or 4 digits';
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

// Luhn algorithm for card validation
function luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

// Show error message
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    input.classList.add('error');

    const errorEl = formGroup.querySelector('.error-message');
    errorEl.textContent = message;
}

// Clear error message
function clearError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    input.classList.remove('error');

    const errorEl = formGroup.querySelector('.error-message');
    errorEl.textContent = '';
}

// Format card number with spaces
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.substring(0, 16);

    // Add spaces every 4 digits
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formatted += ' ';
        }
        formatted += value[i];
    }

    input.value = formatted;
}

// Format expiry date
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }

    input.value = value;
}

// Process payment
function processPayment(method) {
    const submitBtn = document.getElementById('submit-btn');
    const btnLabel = method === 'cod' ? 'Placing Order...' : 'Processing...';

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <div class="spinner"></div>
        <span>${btnLabel}</span>
    `;

    // Simulate payment processing
    setTimeout(() => {
        // Generate order ID
        const orderId = generateOrderId();

        // Clear cart
        clearCart();

        // Show success modal
        showOrderSuccess(orderId, method);

        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span>Pay Now</span>
        `;
    }, 2000);
}

// Generate order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SH-${timestamp}-${random}`;
}

// Show order success modal
function showOrderSuccess(orderId, method) {
    const modal = document.getElementById('success-modal');
    const orderIdEl = document.getElementById('order-id');
    const modalContent = modal.querySelector('.modal-content');

    orderIdEl.textContent = orderId;

    // Update success message based on payment method
    if (method === 'cod') {
        modalContent.querySelector('h2').textContent = 'Order Placed!';
        modalContent.querySelector('.success-message').textContent = 'Your order has been confirmed. You will pay on delivery.';
        modalContent.querySelector('.success-details').textContent = 'Your order will be delivered within 3-5 business days. Please have cash ready.';
    } else {
        modalContent.querySelector('h2').textContent = 'Payment Successful!';
        modalContent.querySelector('.success-message').textContent = 'Your order has been confirmed and payment processed.';
        modalContent.querySelector('.success-details').textContent = 'You will receive your sneakers within 3-5 business days.';
    }

    modal.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close modal on click outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('success-modal');
    if (e.target === modal) {
        // Don't close - user must use buttons
    }
});
