// ===========================================
// Order Confirmation Module for SneakerHub
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    initOrderConfirmation();
});

function initOrderConfirmation() {
    // Update cart badge
    updateCartBadge();

    // Load order data from localStorage
    const orderData = localStorage.getItem('lastOrder');

    if (!orderData) {
        // No order data - redirect to home
        window.location.href = 'index.html';
        return;
    }

    const order = JSON.parse(orderData);

    // Populate order details
    document.getElementById('order-id').textContent = order.orderId;
    document.getElementById('confirmation-address').textContent =
        `${order.fullName}, ${order.address}, ${order.city} ${order.postal}, Phone: ${order.phone}`;

    const deliveryText = order.deliveryMethod === 'Standard'
        ? `Standard Delivery (${order.deliveryDays} business days)`
        : `Express Delivery (${order.deliveryDays} business days)`;

    document.getElementById('confirmation-delivery').textContent =
        `${deliveryText} - Estimated: ${order.deliveryDate}`;

    document.getElementById('confirmation-total').textContent = `$${order.total.toFixed(2)}`;

    // Clear order data after displaying (optional - keep for page refresh)
    // localStorage.removeItem('lastOrder');
}