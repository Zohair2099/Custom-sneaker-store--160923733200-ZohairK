# SneakerHub - Premium Sneaker Store

A modern, responsive e-commerce web application for sneakers built with HTML, CSS, and vanilla JavaScript.

Live link : https://zohair2099.github.io/Custom-sneaker-store--160923733200-ZohairK/

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Pages Overview](#pages-overview)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [How to Run](#how-to-run)
- [How to Use](#how-to-use)
- [Form Validation Details](#form-validation-details)
- [Code Architecture](#code-architecture)
- [Responsive Breakpoints](#responsive-breakpoints)
- [Browser Compatibility](#browser-compatibility)
- [Future Improvements](#future-improvements)
- [Credits](#credits)
- [License](#license)

---

## Description

**SneakerHub** is a complete static e-commerce web application designed as a college demo project. It showcases a modern sneaker store with full shopping cart functionality, product filtering, search capabilities, and a secure checkout process — all built **without any frameworks or libraries**.

This project demonstrates proficiency in:
- Semantic HTML5 structure
- Modern CSS3 with Custom Properties, Flexbox, and Grid
- Vanilla ES6+ JavaScript with modular architecture
- LocalStorage API for data persistence
- Client-side form validation with Luhn algorithm
- Responsive, mobile-first design

---

## Features

### Product Catalog
- **12 premium sneakers** from top brands (Nike, Adidas, Puma, Jordan, Reebok, New Balance, Under Armour)
- Responsive product cards with smooth hover effects and animations
- Color-coded category badges (Running = purple, Casual = pink, Sports = blue)
- Star rating display (4.4 - 4.9 stars)
- Interactive size selector with visual feedback
- Product overlay with "Add to Cart" on hover

### Search & Filter System
- **Real-time search** by product name or brand (300ms debounce)
- **Category filter** dropdown: All, Running, Casual, Sports
- **Price sorting**: Default, Low to High, High to Low
- **Dynamic results counter** showing filtered product count
- **URL parameter support** for direct category linking

### 🛒 Shopping Cart
- Add products with size selection (validation prevents adding without size)
- Quantity controls (+/- buttons) with real-time updates
- Remove individual items or clear entire cart
- **Persistent cart** using localStorage (survives page refresh)
- Real-time cart badge in navigation bar
- Free shipping on orders over $100
- Automatic tax calculation (8%)
- Subtotal, shipping, tax, and grand total display

### Checkout System
- **Order summary** with item breakdown (image, name, size, quantity, price)
- **Customer details form**: Full name, email, phone, address, city, postal code
- **Payment form**: Cardholder name, card number, expiry date, CVV
- **Full client-side validation** with inline error messages
- **Luhn algorithm** for credit card number validation
- Auto-formatting: card number (spaces every 4 digits), expiry (MM/YY)
- Loading spinner during simulated payment processing
- **Success modal** with auto-generated order ID (format: `SH-TIMESTAMP-RANDOM`)
- Cart automatically clears after successful order

### User Experience
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions throughout
- Toast notifications for user feedback (success/error)
- Loading states for async operations
- Empty state messages with helpful CTAs
- Keyboard-accessible navigation and forms
- High contrast mode support

---

## Pages Overview

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | Landing page with hero, features, featured products, brands, newsletter |
| **Products** | `products.html` | Full catalog with search, filter, sort functionality |
| **Cart** | `cart.html` | Shopping cart management with totals |
| **Payment** | `payment.html` | Checkout form with validation and order confirmation |
| **Terms of Use** | `terms-of-use.html` | Terms and conditions for site usage |
| **Privacy Policy** | `privacy-policy.html` | Data collection and privacy practices |
| **Store Claim Policy** | `store-claim-policy.html` | Returns, refunds, and claims process |

---

## Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| **HTML5** | Latest | Semantic markup, accessibility |
| **CSS3** | Latest | Styling, animations, responsive design |
| **JavaScript** | ES6+ | Application logic, DOM manipulation |
| **SVG** | - | Vector graphics for icons and product images |
| **LocalStorage API** | - | Cart persistence across sessions |

### No External Dependencies
- ✅ No CSS frameworks (Bootstrap, Tailwind, etc.)
- ✅ No JavaScript libraries (jQuery, React, Vue, etc.)
- ✅ No build tools (Webpack, Vite, etc.)
- ✅ No external CDN dependencies

---

## Project Structure

```
sneaker-store/
├── index.html              # Landing page
├── products.html           # Products catalog
├── cart.html               # Shopping cart
├── payment.html            # Checkout page
├── terms-of-use.html       # Terms of use page
├── privacy-policy.html     # Privacy policy page
├── store-claim-policy.html # Store claim policy page
├── README.md               # This documentation
├── .gitignore              # Git ignore patterns
├── css/
│   └── style.css           # Complete stylesheet (3,500+ lines)
├── js/
│   ├── main.js             # Core utilities (nav, notifications, helpers)
│   ├── products.js         # Product data & helper functions
│   ├── cart.js             # Cart logic & localStorage management
│   └── payment.js          # Payment validation & processing
├── assets/
│   ├── favicon.svg         # Site favicon
│   └── images/
│       ├── hero-sneaker.svg    # Hero section image
│       └── sneaker1-12.svg     # 12 product placeholder images
└── docs/
    ├── PROJECT_LOG.md      # Development timeline log
    └── REQUIREMENTS.md     # Requirements checklist
```

---

## Installation & Setup

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: Local web server for best experience

### Quick Start
```bash
# Clone or download the project
# Navigate to project directory
cd sneaker-store

# Option 1: Open directly (double-click index.html)
# Option 2: Start local server (recommended)
```

---

## How to Run

### Method 1: Direct File Open (Easiest)
1. Navigate to the project folder
2. Double-click `index.html`
3. Opens in your default browser

> ⚠️ **Note**: Some features (like ES6 modules, fetch) may not work with `file://` protocol. Use Method 2 for full functionality.

### Method 2: Local Web Server (Recommended)

#### Using Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then visit: `http://localhost:8000`

#### Using Node.js
```bash
# Using npx (no install needed)
npx serve

# Or install globally
npm install -g serve
serve
```

#### Using VS Code
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

#### Using PHP
```bash
php -S localhost:8000
```

---

## How to Use

### Browsing Products
1. Open the application → **Products** page
2. **Search**: Type in search box (filters by name/brand in real-time)
3. **Filter**: Select category from dropdown (Running, Casual, Sports)
4. **Sort**: Choose price order from dropdown
5. Results update instantly with count display

### Adding to Cart
1. Browse products on Home or Products page
2. **Select a size** from the size buttons on the product card
3. Click **"Add to Cart"** button
4. Success notification appears
5. Cart badge in navigation updates automatically

### Managing Cart
1. Click **Cart** in navigation (or badge)
2. **Adjust quantity**: Use + / - buttons
3. **Remove item**: Click trash icon
4. **Clear cart**: Click "Clear Cart" button
5. Totals recalculate automatically:
   - Subtotal: Sum of all items
   - Shipping: $9.99 (free over $100)
   - Tax: 8% of subtotal
   - Total: Subtotal + Shipping + Tax

### Checkout Process
1. Click **"Proceed to Payment"** from Cart
2. **Order Summary**: Review items and totals
3. **Customer Details** (Section 1):
   - Fill all required fields
   - Real-time validation shows errors inline
4. **Payment Details** (Section 2):
   - Cardholder name (as on card)
   - Card number (16 digits, auto-formatted)
   - Expiry date (MM/YY format, auto-formatted)
   - CVV (3-4 digits)
5. Click **"Pay Now"**
6. Loading spinner shows during processing
7. **Success modal** appears with Order ID
8. Click "Continue Shopping" or "Back to Home"
9. Cart is automatically cleared

---

## Form Validation Details

### Customer Information (Section 1)

| Field | Required | Validation Rules | Error Messages |
|-------|----------|------------------|----------------|
| **Full Name** | ✅ | Letters & spaces only, min 2 chars | "Full name is required" / "Name should contain only letters and spaces" / "Name must be at least 2 characters" |
| **Email** | ✅ | Valid email format (regex) | "Email address is required" / "Please enter a valid email address" |
| **Phone** | ✅ | 10 digits only | "Phone number is required" / "Phone number must be 10 digits" |
| **Address** | ✅ | Min 5 characters | "Street address is required" / "Please enter a complete address" |
| **City** | ✅ | Letters & spaces only | "City is required" / "City should contain only letters" |
| **Postal Code** | ✅ | 5-6 alphanumeric chars | "Postal code is required" / "Postal code must be at least 5 characters" |

### Payment Information (Section 2)

| Field | Required | Validation Rules | Error Messages |
|-------|----------|------------------|----------------|
| **Cardholder Name** | ✅ | Letters & spaces only | "Cardholder name is required" / "Name should contain only letters and spaces" |
| **Card Number** | ✅ | 16 digits, **Luhn algorithm** | "Card number is required" / "Card number must be 16 digits" / "Invalid card number" |
| **Expiry Date** | ✅ | MM/YY format, not expired | "Expiry date is required" / "Use MM/YY format" / "Invalid month (01-12)" / "Card has expired" |
| **CVV** | ✅ | 3-4 digits | "CVV is required" / "CVV must be 3 or 4 digits" |

### Luhn Algorithm Implementation
The payment form uses the **Luhn algorithm (mod 10)** to validate credit card numbers:
```javascript
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
```

### Auto-Formatting Behaviors
- **Card Number**: Auto-inserts space every 4 digits (e.g., `1234 5678 9012 3456`)
- **Expiry Date**: Auto-inserts `/` after 2 digits (e.g., `12/25`)
- **Phone/CVV/Postal**: Strips non-numeric characters

---

## Code Architecture

### Modular JavaScript Structure

#### `js/products.js` - Product Data Module
```javascript
const products = [/* 12 product objects */];
// Exported functions:
// - getAllProducts()
// - getProductById(id)
// - getProductsByCategory(category)
// - searchProducts(query)
// - sortProducts(list, order)
```

#### `js/cart.js` - Cart State Management
```javascript
let cart = []; // In-memory state
// Functions:
// - loadCart() / saveCart() - localStorage sync
// - addToCart(productId, quantity, size)
// - removeFromCart(productId, size)
// - updateQuantity(productId, quantity, size)
// - clearCart()
// - getCartSubtotal() / getShippingCost() / getTaxAmount() / getGrandTotal()
// - renderCartPage() - DOM rendering
```

#### `js/main.js` - Shared Utilities
```javascript
// Functions:
// - initNavbar() - Active link highlighting
// - initMobileMenu() - Hamburger menu toggle
// - updateCartBadge() - Navbar cart count
// - formatCurrency(amount)
// - generateStarRating(rating)
// - showNotification(message, type)
// - debounce(func, wait) / throttle(func, limit)
```

#### `js/payment.js` - Checkout Logic
```javascript
// Functions:
// - initPaymentPage() - Entry point
// - renderOrderSummary() - Cart to order display
// - validateField(input) - Per-field validation
// - luhnCheck(cardNumber) - Card validation
// - formatCardNumber(input) / formatExpiryDate(input)
// - processPayment() - Simulated async payment
// - generateOrderId() - Unique ID generation
// - showOrderSuccess(orderId) - Modal display
```

### CSS Architecture

#### Custom Properties (CSS Variables)
```css
:root {
    --primary-color: #ff6b35;
    --primary-dark: #e55a2b;
    --secondary-color: #1a1a2e;
    --text-primary: #1a1a2e;
    --bg-primary: #ffffff;
    --bg-secondary: #f8f9fa;
    --border-color: #e0e0e0;
    --success-color: #28a745;
    --error-color: #dc3545;
    --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
    --shadow-lg: 0 8px 24px rgba(0,0,0,0.2);
    --transition: all 0.3s ease;
    --border-radius: 8px;
    --border-radius-lg: 16px;
}
```

#### Layout Systems
- **CSS Grid**: Hero, product grids, feature grids, payment layout
- **Flexbox**: Navigation, cards, forms, footer
- **Mobile-first**: Base styles for mobile, progressive enhancement

---

## Responsive Breakpoints

| Breakpoint | Target Devices | Layout Changes |
|------------|----------------|----------------|
| **1200px+** | Large desktop | 4-column product grid, full navigation |
| **992px** | Tablet landscape | 2-column product grid, stacked filters |
| **768px** | Tablet portrait | Single column products, hamburger menu |
| **480px** | Mobile | Condensed spacing, full-width buttons, stacked forms |

### Key Responsive Features
- Navigation collapses to hamburger menu on mobile
- Product grid adapts from 4 → 2 → 1 columns
- Payment form stacks to single column
- Cart items stack vertically on small screens
- Font sizes scale with viewport
- Touch-friendly button sizes (min 44px)

---

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| **Chrome** | 80+ | ✅ Full |
| **Firefox** | 75+ | ✅ Full |
| **Safari** | 13+ | ✅ Full |
| **Edge** | 80+ | ✅ Full |
| **Opera** | 67+ | ✅ Full |

### Features Used (Modern but Well-Supported)
- CSS Custom Properties
- Flexbox & Grid
- `localStorage` API
- `fetch` (not used - no network requests)
- Arrow functions, const/let, template literals
- `classList`, `querySelector`, `addEventListener`
- `dataset` API for data attributes

---

- **Project Type**: College Demo Project
- **Author**: Zohair K
- **Date**: August 2026
- **Inspiration**: Modern e-commerce design patterns

### Asset Credits
- All product images: Custom png
- Icons: Custom png icons (inline)
- Fonts: System fonts (Segoe UI, Tahoma, Geneva, Verdana, sans-serif)

---

## License

This project is for **educational purposes only**.

All product names, brands, logos, and images are property of their respective owners and are used solely for demonstration purposes in this academic project.

---

© 2026 SneakerHub. All rights reserved.