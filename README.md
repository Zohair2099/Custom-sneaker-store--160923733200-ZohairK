# Sneaker Store - Static Web Application

A responsive, user-friendly e-commerce website for sneakers built using only HTML, CSS, and vanilla JavaScript. This is a college demo project demonstrating modern web development practices without any frameworks.

## Project Description

Sneaker Store is a complete front-end web application that simulates an online sneaker shopping experience. It features a modern, clean design with smooth animations, responsive layout, and full shopping cart functionality using localStorage for data persistence.

## Features

- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Product Catalog**: Browse 12 sneakers with detailed information
- **Search & Filter**: Search by name/brand, filter by category, sort by price
- **Shopping Cart**: Add items, adjust quantities, remove products
- **Persistent Cart**: Cart data saved in localStorage
- **Form Validation**: Complete client-side validation on payment form
- **Modern UI**: Clean design with CSS animations and transitions
- **No Frameworks**: Built with pure HTML, CSS, and JavaScript

## Pages Included

| Page | File | Description |
|------|------|-------------|
| Landing Page | `index.html` | Hero section, featured products, features, testimonials |
| Products Page | `products.html` | Product grid with search, filter, and sort functionality |
| Shopping Cart | `cart.html` | Cart management with quantity controls and totals |
| Payment Page | `payment.html` | Checkout form with validation |
| GitHub Info | `github.html` | Repository information and upload instructions |

## Technologies Used

- **HTML5**: Semantic markup, accessible forms
- **CSS3**: Flexbox, Grid, CSS Variables, Animations
- **JavaScript**: ES6+, localStorage, DOM manipulation
- **SVG**: Vector graphics for sneaker images

## Folder Structure

```
sneaker-store/
├── index.html              # Landing page
├── products.html           # Product listing page
├── cart.html               # Shopping cart page
├── payment.html            # Checkout page
├── github.html             # GitHub information page
├── README.md               # Project documentation
├── .gitignore              # Git ignore file
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── main.js             # Common functionality
│   ├── products.js         # Product data and helpers
│   ├── cart.js             # Cart management
│   └── payment.js          # Payment form handling
├── assets/
│   ├── images/             # SVG sneaker images
│   └── favicon.svg         # Site favicon
└── docs/
    ├── PROJECT_LOG.md      # Development log
    └── REQUIREMENTS.md     # Project requirements
```

## How to Run the Project

### Option 1: Direct Browser Opening
Simply double-click on `index.html` to open it in your default browser.

### Option 2: Local Server (Recommended)
Using Python:
```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

Using Node.js:
```bash
# Install serve globally
npm install -g serve

# Run server
serve .

# Open the provided localhost URL
```

Using VS Code:
- Install "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

## How to Use the Website

1. **Browse Products**: Navigate to Products page to see all sneakers
2. **Search/Filter**: Use the search bar and filters to find specific products
3. **Add to Cart**: Select your size and click "Add to Cart"
4. **View Cart**: Click on "Cart" in the navigation to review items
5. **Checkout**: Click "Proceed to Payment" and fill out the form
6. **Complete Order**: Submit the form to see order confirmation

## Form Validation Details

The payment form includes comprehensive validation:

| Field | Validation Rules |
|-------|-----------------|
| Full Name | Required, letters and spaces only, minimum 2 characters |
| Email | Required, valid email format |
| Phone | Required, 10 digits |
| Address | Required, minimum 5 characters |
| City | Required, letters only |
| Postal Code | Required, 5-6 digits |
| Cardholder Name | Required, letters and spaces only |
| Card Number | Required, 16 digits, Luhn algorithm validation |
| Expiry Date | Required, MM/YY format, not expired |
| CVV | Required, 3-4 digits |

## GitHub Repository

This project is prepared for GitHub upload. Visit the GitHub page (`github.html`) for detailed instructions on how to upload this project to your repository.

**Repository Link**: `https://github.com/YOUR_USERNAME/sneaker-store`

## Screenshots

*Screenshots can be added here after project completion*

## Future Improvements

- Add user authentication system
- Implement backend with database
- Add product reviews and ratings
- Include wishlist functionality
- Add multiple product images
- Implement product comparison feature
- Add order history tracking
- Integrate real payment gateway
- Add admin panel for product management
- Implement email notifications

## Author

**College Demo Project**

Created as part of web development coursework to demonstrate proficiency in HTML, CSS, and JavaScript.

---

&copy; 2026 SneakerStore. All rights reserved.
