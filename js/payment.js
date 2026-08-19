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

// Get selected delivery method
function getSelectedDeliveryMethod() {
    const radio = document.querySelector('input[name="deliveryMethod"]:checked');
    if (!radio) return { value: 'standard', days: 5, cost: 0 };
    return {
        value: radio.value,
        days: parseInt(radio.dataset.days),
        cost: parseFloat(radio.dataset.cost)
    };
}

// Get shipping cost including delivery method
function getShippingCost() {
    const subtotal = getCartSubtotal();
    const baseShipping = subtotal >= 100 ? 0 : 9.99;
    const delivery = getSelectedDeliveryMethod();
    return baseShipping + delivery.cost;
}

// Update order summary with delivery method
function updateDeliverySummary() {
    const delivery = getSelectedDeliveryMethod();
    const shippingEl = document.getElementById('summary-shipping');
    const totalEl = document.getElementById('summary-total');

    if (shippingEl) {
        const shippingCost = getShippingCost();
        shippingEl.textContent = shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`;
    }
    if (totalEl) {
        const subtotal = getCartSubtotal();
        const shipping = getShippingCost();
        const tax = getTaxAmount();
        const total = subtotal + shipping + tax;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }
}

// Update shipping details if visible (COD step 2)
function updateShippingDetailsIfVisible() {
    const shippingSection = document.getElementById('shipping-details-section');
    if (shippingSection && shippingSection.classList.contains('visible')) {
        const delivery = getSelectedDeliveryMethod();
        const now = new Date();
        const deliveryDate = new Date(now.getTime() + delivery.days * 24 * 60 * 60 * 1000);
        const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const estimatedDeliveryEl = shippingSection.querySelector('.shipping-detail-value:nth-of-type(2)');
        if (estimatedDeliveryEl) {
            estimatedDeliveryEl.textContent = `${deliveryDateStr} (${delivery.days} business days)`;
        }

        const amountEl = shippingSection.querySelector('.shipping-detail-value:last-of-type');
        if (amountEl) {
            const subtotal = getCartSubtotal();
            const shipping = getShippingCost();
            const tax = getTaxAmount();
            const total = subtotal + shipping + tax;
            amountEl.textContent = `$${total.toFixed(2)}`;
        }
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('payment-form');
    const inputs = form.querySelectorAll('input');

    // Delivery method selector
    const deliveryRadios = form.querySelectorAll('input[name="deliveryMethod"]');
    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateDeliverySummary();
            updateShippingDetailsIfVisible();
        });
    });

    // Initial delivery summary update
    updateDeliverySummary();

    // Add input event listeners for real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Format specific fields
            if (input.id === 'phone') {
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

        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
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
        processPayment();
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

// Process payment
function processPayment() {
    const submitBtn = document.getElementById('submit-btn');
    const submitBtnText = document.getElementById('submit-btn-text');

    // For COD, use two-step flow: first show shipping details, then confirm
    handleCODFlow(submitBtn, submitBtnText);
}

// Handle COD two-step flow: show shipping details, then confirm
let codStep = 1;
let codOrderId = null;

function handleCODFlow(submitBtn, submitBtnText) {
    const shippingSection = document.getElementById('shipping-details-section');
    const shippingDetails = document.getElementById('shipping-details');

    if (codStep === 1) {
        // Step 1: Generate shipping details and show them
        codOrderId = generateOrderId();
        codStep = 2;

        // Generate shipping details HTML
        const details = generateShippingDetails(codOrderId);
        shippingDetails.innerHTML = details;

        // Show shipping section with animation
        shippingSection.style.display = 'block';
        setTimeout(() => {
            shippingSection.classList.add('visible');
        }, 10);

        // Update button text
        submitBtnText.textContent = 'Proceed to Delivery';
        submitBtn.disabled = false;
    } else if (codStep === 2) {
        // Step 2: Confirm and place order
        codStep = 1;
        shippingSection.classList.remove('visible');

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="spinner"></div>
            <span>Placing Order...</span>
        `;

        setTimeout(() => {
            // Clear cart
            clearCart();

            // Store order data for confirmation page
            const delivery = getSelectedDeliveryMethod();
            const now = new Date();
            const deliveryDate = new Date(now.getTime() + delivery.days * 24 * 60 * 60 * 1000);
            const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const fullName = document.getElementById('full-name').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const postal = document.getElementById('postal').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;

            const subtotal = getCartSubtotal();
            const shipping = getShippingCost();
            const tax = getTaxAmount();
            const total = subtotal + shipping + tax;

            const orderData = {
                orderId: codOrderId,
                fullName,
                address,
                city,
                postal,
                phone,
                email,
                deliveryMethod: delivery.value === 'standard' ? 'Standard' : 'Express',
                deliveryDays: delivery.days,
                deliveryDate: deliveryDateStr,
                total: total
            };

            localStorage.setItem('lastOrder', JSON.stringify(orderData));

            // Redirect to order confirmation page
            window.location.href = 'order-confirmation.html';
        }, 1500);
    }
}

// Generate shipping details for COD
function generateShippingDetails(orderId) {
    const delivery = getSelectedDeliveryMethod();
    const now = new Date();
    const deliveryDate = new Date(now.getTime() + delivery.days * 24 * 60 * 60 * 1000);
    const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const shippingCost = getShippingCost();
    const subtotal = getCartSubtotal();
    const total = getGrandTotal();

    // Get customer details from form
    const fullName = document.getElementById('full-name').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postal = document.getElementById('postal').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    const items = cart.map(item => {
        const product = getProductById(item.productId);
        return product ? `${product.name} (Size: ${item.size}) x${item.quantity}` : '';
    }).filter(Boolean).join(', ');

    return `
        <div class="shipping-detail-row">
            <div class="shipping-detail-label">Order ID</div>
            <div class="shipping-detail-value">${orderId}</div>
        </div>
        <div class="shipping-detail-row">
            <div class="shipping-detail-label">Estimated Delivery</div>
            <div class="shipping-detail-value">${deliveryDateStr} (${delivery.days} business days)</div>
        </div>
        <div class="shipping-detail-row">
            <div class="shipping-detail-label">Delivery Method</div>
            <div class="shipping-detail-value">${delivery.value === 'standard' ? 'Standard' : 'Express'}</div>
        </div>
        <div class="shipping-detail-row">
            <div class="shipping-detail-label">Shipping Address</div>
            <div class="shipping-detail-value">
                ${fullName}<br>
                ${address}<br>
                ${city} ${postal}<br>
                Phone: ${phone}
            </div>
        </div>
        <div class="shipping-detail-row">
            <div class="shipping-detail-label">Contact Email</div>
            <div class="shipping-detail-value">${email}</div>
        </div>
        <div class="shipping-detail-row">
            <div class="shipping-detail-label">Items</div>
            <div class="shipping-detail-value">${items}</div>
        </div>
        <div class="shipping-detail-row total">
            <div class="shipping-detail-label">Amount to Pay on Delivery</div>
            <div class="shipping-detail-value">$${total.toFixed(2)}</div>
        </div>
        <p class="shipping-note">Please have exact cash amount ready for delivery.</p>
    `;
}

// Generate order ID
function generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SH-${timestamp}-${random}`;
}
