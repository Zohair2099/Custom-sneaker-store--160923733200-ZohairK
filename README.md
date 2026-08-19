# SneakerHub - Premium Sneaker Store

A modern, responsive e-commerce web application for sneakers built with HTML, CSS, and vanilla JavaScript.

![SneakerHub Preview](assets/images/hero-sneaker.svg)

## Description

SneakerHub is a complete static e-commerce web application designed as a college demo project. It showcases a modern sneaker store with full shopping cart functionality, product filtering, search capabilities, and a secure checkout process - all built without any frameworks or libraries.

## Features

### Product Catalog
- 12 premium sneakers from top brands (Nike, Adidas, Puma, Jordan, etc.)
- Responsive product cards with hover effects
- Category badges (Running, Casual, Sports)
- Star ratings display
- Size selector for each product

### Search & Filter
- Real-time search by product name or brand
- Filter by category (Running, Casual, Sports)
- Sort by price (Low to High, High to Low)
- Dynamic results count

### Shopping Cart
- Add products with size selection
- Quantity controls (increase/decrease)
- Remove individual items or clear entire cart
- Persistent cart using localStorage
- Real-time cart badge updates

### Checkout
- Order summary with item breakdown
- Customer details form
- Payment card form
- Full client-side validation
- Luhn algorithm for card validation
- Success modal with order confirmation
- Auto-generated order IDs

### User Experience
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Toast notifications for user feedback
- Loading states for actions
- Empty state messages

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Landing page with hero section, features, featured products, newsletter |
| `products.html` | Product catalog with search, filter, and sort functionality |
| `cart.html` | Shopping cart management |
| `payment.html` | Checkout form with validation |
| `github.html` | GitHub repository information |

## Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Styling with CSS variables, Flexbox, Grid, animations
- **JavaScript (ES6+)** - DOM manipulation, localStorage, form validation
- **SVG** - Vector graphics for icons and product images
- **LocalStorage API** - Cart persistence

## Folder Structure

```
sneaker-store/
├── index.html              # Landing page
├── products.html           # Products catalog
├── cart.html               # Shopping cart
├── payment.html            # Checkout page
├── github.html             # GitHub info
├── README.md               # Documentation
├── .gitignore              # Git ignore file
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── main.js             # Core functions (nav, notifications)
│   ├── products.js         # Product data and helper functions
│   ├── cart.js             # Cart logic and localStorage
│   └── payment.js          # Payment form validation
├── assets/
│   ├── favicon.svg         # Site favicon
│   └── images/             # SVG images
│       ├── hero-sneaker.svg
│       └── sneaker1-12.svg
└── docs/
    ├── PROJECT_LOG.md      # Development log
    └── REQUIREMENTS.md     # Requirements checklist
```

## How to Run

### Option 1: Open Directly
Simply open `index.html` in your web browser.

### Option 2: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using VS Code
# Install "Live Server" extension and click "Go Live"
```

Then visit `http://localhost:8000`

## How to Use

### Browsing Products
1. Navigate to **Products** page
2. Use the search bar to find specific sneakers
3. Filter by category using the dropdown
4. Sort by price if needed

### Adding to Cart
1. Click on a product card
2. Select your size from the size buttons
3. Click "Add to Cart" button
4. A success notification will appear

### Managing Cart
1. Click **Cart** in navigation
2. Adjust quantities using +/- buttons
3. Remove items with the trash icon
4. Clear entire cart with "Clear Cart" button

### Checkout
1. Review order summary
2. Fill in customer details
3. Enter payment information
4. Click "Pay Now"
5. Receive order confirmation

## Validation Details

### Customer Form
| Field | Validation Rules |
|-------|-----------------|
| Full Name | Required, letters only, min 2 characters |
| Email | Required, valid email format |
| Phone | Required, 10 digits |
| Address | Required, min 5 characters |
| City | Required, letters only |
| Postal Code | Required, 5-6 characters |

### Payment Form
| Field | Validation Rules |
|-------|-----------------|
| Cardholder Name | Required, letters only |
| Card Number | Required, 16 digits, Luhn algorithm |
| Expiry Date | Required, MM/YY format, not expired |
| CVV | Required, 3-4 digits |

### Card Number Validation
- Uses **Luhn algorithm** to verify card validity
- Automatic formatting with spaces (1234 5678 9012 3456)
- Accepts Visa, Mastercard, and American Express

## Pricing

- All prices are in USD
- Free shipping on orders over $100
- 8% tax applied to all orders
- Subtotal, shipping, tax, and total displayed in cart and checkout

## GitHub Repository

[GitHub Repository Link Placeholder]

Replace this with your actual repository URL before submission.

## Future Improvements

1. **Backend Integration**
   - Connect to a real database for product management
   - Implement server-side payment processing
   - Add user authentication and accounts

2. **Enhanced Features**
   - Product reviews and ratings
   - Wishlist functionality
   - Size guides and fit recommendations
   - Product comparison tool

3. **Performance**
   - Lazy loading for product images
   - Image optimization
   - Caching strategies

4. **Accessibility**
   - Enhanced keyboard navigation
   - Screen reader optimization
   - High contrast mode

5. **Additional Pages**
   - About Us page
   - Contact page with form
   - FAQ section
   - Order tracking

6. **Mobile App**
   - Progressive Web App (PWA) support
   - Push notifications
   - Offline functionality

## Credits

- **Project**: College Demo Project
- **Author**: Zohair K
- **Date**: August 2026

## License

This project is for educational purposes only. All product names, brands, and images are used for demonstration purposes.

---

© 2026 SneakerHub. All rights reserved.
