// ===========================================
// Shopping Cart Module for Sneaker Store
// ===========================================

// Cart state
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('sneakerCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    return cart;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('sneakerCart', JSON.stringify(cart));
    updateCartBadge();
}

// Add item to cart
function addToCart(productId, quantity = 1, size = null) {
    loadCart();

    const product = getProductById(productId);
    if (!product) return false;

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
        item => item.id === productId && item.size === size
    );

    if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.image,
            quantity: quantity,
            size: size || product.sizes[0]
        });
    }

    saveCart();
    return true;
}

// Remove item from cart
function removeFromCart(productId, size = null) {
    loadCart();

    if (size) {
        cart = cart.filter(item => !(item.id === productId && item.size === size));
    } else {
        cart = cart.filter(item => item.id !== productId);
    }

    saveCart();
    return cart;
}

// Update item quantity
function updateQuantity(productId, quantity, size = null) {
    loadCart();

    const itemIndex = cart.findIndex(
        item => item.id === productId && item.size === size
    );

    if (itemIndex !== -1) {
        if (quantity <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = quantity;
        }
        saveCart();
    }

    return cart;
}

// Clear entire cart
function clearCart() {
    cart = [];
    saveCart();
    return cart;
}

// Get cart total items count
function getCartCount() {
    loadCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Get cart subtotal
function getCartSubtotal() {
    loadCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
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

// Update cart badge in navbar
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const count = getCartCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Show add to cart notification
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

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Render cart items on cart page
function renderCartPage() {
    loadCart();

    const cartContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');

    if (!cartContainer) return;

    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';

    // Render cart items
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-brand">${item.brand}</p>
                <p class="cart-item-size">Size: ${item.size}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn decrease" onclick="handleQuantityChange(${item.id}, ${item.size}, -1)">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn increase" onclick="handleQuantityChange(${item.id}, ${item.size}, 1)">+</button>
            </div>
            <div class="cart-item-price">
                <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                <p class="unit-price">$${item.price.toFixed(2)} each</p>
            </div>
            <button class="remove-item" onclick="handleRemoveItem(${item.id}, ${item.size})">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
            </button>
        </div>
    `).join('');

    // Update totals
    updateCartTotals();
}

// Handle quantity change
function handleQuantityChange(productId, size, change) {
    loadCart();

    const item = cart.find(i => i.id === productId && i.size === size);
    if (item) {
        const newQuantity = item.quantity + change;
        updateQuantity(productId, newQuantity, size);
        renderCartPage();
    }
}

// Handle remove item
function handleRemoveItem(productId, size) {
    removeFromCart(productId, size);
    showNotification('Item removed from cart', 'info');
    renderCartPage();
}

// Handle clear cart
function handleClearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        clearCart();
        showNotification('Cart cleared', 'info');
        renderCartPage();
    }
}

// Update cart totals display
function updateCartTotals() {
    const subtotal = getCartSubtotal();
    const shipping = getShippingCost();
    const tax = getTaxAmount();
    const total = getGrandTotal();

    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartBadge();
});
