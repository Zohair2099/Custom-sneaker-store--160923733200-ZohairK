// ===========================================
// Product Data for Sneaker Store
// ===========================================

const products = [
    {
        id: 1,
        name: "Air Max Velocity",
        brand: "Nike",
        price: 189.99,
        category: "running",
        image: "assets/images/sneaker1.svg",
        rating: 4.8,
        description: "Lightweight running sneakers with advanced cushioning technology for maximum comfort during your runs.",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 2,
        name: "Street Runner Pro",
        brand: "Adidas",
        price: 159.99,
        category: "casual",
        image: "assets/images/sneaker2.svg",
        rating: 4.6,
        description: "Stylish streetwear sneakers perfect for everyday casual outfits and light activities.",
        sizes: [6, 7, 8, 9, 10, 11]
    },
    {
        id: 3,
        name: "Thunder Bolt X",
        brand: "Puma",
        price: 134.99,
        category: "sports",
        image: "assets/images/sneaker3.svg",
        rating: 4.5,
        description: "High-performance sports sneakers designed for agility and speed on the court or field.",
        sizes: [7, 8, 9, 10, 11]
    },
    {
        id: 4,
        name: "Classic Retro",
        brand: "New Balance",
        price: 124.99,
        category: "casual",
        image: "assets/images/sneaker4.svg",
        rating: 4.7,
        description: "Timeless retro design with modern comfort features. Perfect for vintage style lovers.",
        sizes: [6, 7, 8, 9, 10, 11, 12]
    },
    {
        id: 5,
        name: "Cloud Walker",
        brand: "Nike",
        price: 199.99,
        category: "running",
        image: "assets/images/sneaker5.svg",
        rating: 4.9,
        description: "Premium running shoes with cloud-like cushioning. Experience ultimate comfort mile after mile.",
        sizes: [7, 8, 9, 10, 11]
    },
    {
        id: 6,
        name: "Urban Legend",
        brand: "Adidas",
        price: 169.99,
        category: "casual",
        image: "assets/images/sneaker6.svg",
        rating: 4.4,
        description: "Bold urban design for those who want to stand out. Premium materials and craftsmanship.",
        sizes: [6, 7, 8, 9, 10, 11, 12]
    },
    {
        id: 7,
        name: "Speed Demon",
        brand: "Puma",
        price: 144.99,
        category: "sports",
        image: "assets/images/sneaker7.svg",
        rating: 4.6,
        description: "Engineered for speed. Lightweight construction with superior grip for competitive sports.",
        sizes: [7, 8, 9, 10, 11]
    },
    {
        id: 8,
        name: "Trail Blazer",
        brand: "Reebok",
        price: 179.99,
        category: "running",
        image: "assets/images/sneaker8.svg",
        rating: 4.7,
        description: "Rugged trail running sneakers with enhanced durability and all-terrain grip.",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 9,
        name: "Court Master",
        brand: "Jordan",
        price: 219.99,
        category: "sports",
        image: "assets/images/sneaker9.svg",
        rating: 4.9,
        description: "Iconic basketball sneakers with legendary style and on-court performance.",
        sizes: [8, 9, 10, 11, 12]
    },
    {
        id: 10,
        name: "Eco Runner",
        brand: "Adidas",
        price: 154.99,
        category: "running",
        image: "assets/images/sneaker10.svg",
        rating: 4.5,
        description: "Sustainable running shoes made from recycled materials without compromising on performance.",
        sizes: [6, 7, 8, 9, 10, 11]
    },
    {
        id: 11,
        name: "Night Rider",
        brand: "Nike",
        price: 189.99,
        category: "casual",
        image: "assets/images/sneaker11.svg",
        rating: 4.6,
        description: "Sleek dark design with reflective accents. Perfect for evening runs and night outings.",
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 12,
        name: "Flex Motion",
        brand: "Under Armour",
        price: 139.99,
        category: "sports",
        image: "assets/images/sneaker12.svg",
        rating: 4.4,
        description: "Flexible training shoes that move with your foot. Ideal for gym workouts and cross-training.",
        sizes: [7, 8, 9, 10, 11]
    }
];

// Get all products
function getAllProducts() {
    return products;
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Get products by category
function getProductsByCategory(category) {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
}

// Search products by name or brand
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );
}

// Sort products by price
function sortProducts(productList, order) {
    const sorted = [...productList];
    if (order === 'low-high') {
        return sorted.sort((a, b) => a.price - b.price);
    } else if (order === 'high-low') {
        return sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, getAllProducts, getProductById, getProductsByCategory, searchProducts, sortProducts };
}
