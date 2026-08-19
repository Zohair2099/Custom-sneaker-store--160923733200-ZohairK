// ===========================================
// Payment Module for Sneaker Store
// ===========================================

// Initialize payment page
function initPaymentPage() {
    loadCart();
    renderOrderSummary();
    setupFormValidation();
}

// Render order summary
function renderOrderSummary() {
    const summaryContainer = document.getElementById('order-summary');
    const emptyCartMessage = document.getElementById('empty-cart-payment');
    const paymentForm = document.getElementById('payment-form-container');

    if (!summaryContainer) return;

    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (paymentForm) paymentForm.style.display = 'none';
        return;
    }

    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (paymentForm) paymentForm.style.display = 'block';

    // Render summary items
    summaryContainer.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="summary-item-info">
                <img src="${item.image}" alt="${item.name}" class="summary-item-image">
                <div class="summary-item-details">
                    <p class="summary-item-name">${item.name}</p>
                    <p class="summary-item-meta">Size: ${item.size} | Qty: ${item.quantity}</p>
                </div>
            </div>
            <p class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
    `).join('');

    // Update totals
    updatePaymentTotals();
}

// Update payment totals
function updatePaymentTotals() {
    const subtotal = getCartSubtotal();
    const shipping = getShippingCost();
    const tax = getTaxAmount();
    const total = getGrandTotal();

    document.getElementById('payment-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('payment-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('payment-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('payment-total').textContent = `$${total.toFixed(2)}`;
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('payment-form');
    if (!form) return;

    // Add input event listeners for real-time validation
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });

    // Form submission
    form.addEventListener('submit', handlePaymentSubmit);
}

// Validate individual field
function validateField(input) {
    const value = input.value.trim();
    const name = input.name;
    let isValid = true;
    let errorMessage = '';

    switch(name) {
        case 'fullName':
            if (!value) {
                isValid = false;
                errorMessage = 'Full name is required';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Name should contain only letters and spaces';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;

        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'phone':
            if (!value) {
                isValid = false;
                errorMessage = 'Phone number is required';
            } else if (!/^\d{10}$/.test(value.replace(/[\s-]/g, ''))) {
                isValid = false;
                errorMessage = 'Phone number must be 10 digits';
            }
            break;

        case 'address':
            if (!value) {
                isValid = false;
                errorMessage = 'Address is required';
            } else if (value.length < 5) {
                isValid = false;
                errorMessage = 'Please enter a complete address';
            }
            break;

        case 'city':
            if (!value) {
                isValid = false;
                errorMessage = 'City is required';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'City should contain only letters';
            }
            break;

        case 'postalCode':
            if (!value) {
                isValid = false;
                errorMessage = 'Postal code is required';
            } else if (!/^\d{5,6}$/.test(value)) {
                isValid = false;
                errorMessage = 'Postal code must be 5-6 digits';
            }
            break;

        case 'cardholderName':
            if (!value) {
                isValid = false;
                errorMessage = 'Cardholder name is required';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Name should contain only letters and spaces';
            }
            break;

        case 'cardNumber':
            const cardNum = value.replace(/\s/g, '');
            if (!cardNum) {
                isValid = false;
                errorMessage = 'Card number is required';
            } else if (!/^\d{16}$/.test(cardNum)) {
                isValid = false;
                errorMessage = 'Card number must be 16 digits';
            } else if (!luhnCheck(cardNum)) {
                isValid = false;
                errorMessage = 'Invalid card number';
            }
            break;

        case 'expiryDate':
            if (!value) {
                isValid = false;
                errorMessage = 'Expiry date is required';
            } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
                isValid = false;
                errorMessage = 'Use MM/YY format';
            } else {
                const [month, year] = value.split('/');
                const now = new Date();
                const currentYear = now.getFullYear() % 100;
                const currentMonth = now.getMonth() + 1;
                const expYear = parseInt(year);
                const expMonth = parseInt(month);

                if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                    isValid = false;
                    errorMessage = 'Card has expired';
                }
            }
            break;

        case 'cvv':
            if (!value) {
                isValid = false;
                errorMessage = 'CVV is required';
            } else if (!/^\d{3,4}$/.test(value)) {
                isValid = false;
                errorMessage = 'CVV must be 3 or 4 digits';
            }
            break;
    }

    if (!isValid) {
        showError(input, errorMessage);
    } else {
        clearError(input);
    }

    return isValid;
}

// Luhn algorithm for card validation
function luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);

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
    if (!formGroup) return;

    input.classList.add('error');

    let errorEl = formGroup.querySelector('.error-message');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        formGroup.appendChild(errorEl);
    }
    errorEl.textContent = message;
}

// Clear error message
function clearError(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    input.classList.remove('error');

    const errorEl = formGroup.querySelector('.error-message');
    if (errorEl) {
        errorEl.textContent = '';
    }
}

// Handle payment form submission
function handlePaymentSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const inputs = form.querySelectorAll('input');
    let isFormValid = true;

    // Validate all fields
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }

    // Process successful payment
    processPayment();
}

// Process payment
function processPayment() {
    // Show loading state
    const submitBtn = document.querySelector('.place-order-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    // Simulate processing delay
    setTimeout(() => {
        // Generate order ID
        const orderId = 'SNK' + Date.now().toString().slice(-8);

        // Clear cart
        clearCart();

        // Show success modal
        showOrderSuccess(orderId);

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Show order success modal
function showOrderSuccess(orderId) {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
            </div>
            <h2>Order Placed Successfully!</h2>
            <p class="order-id">Order ID: <strong>${orderId}</strong></p>
            <p class="success-message">Thank you for your purchase! You will receive an email confirmation shortly.</p>
            <div class="success-actions">
                <a href="index.html" class="btn btn-secondary">Back to Home</a>
                <a href="products.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Trigger animation
    setTimeout(() => modal.classList.add('show'), 10);
}

// Format card number input
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '').replace(/\D/g, '');
    let formatted = '';

    for (let i = 0; i < value.length && i < 16; i++) {
        if (i > 0 && i % 4 === 0) {
            formatted += ' ';
        }
        formatted += value[i];
    }

    input.value = formatted;
}

// Format expiry date input
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }

    input.value = value;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initPaymentPage);
