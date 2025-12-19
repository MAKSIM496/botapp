const tg = window.Telegram.WebApp;

tg.expand(); // Expand to full height

const products = [
    { id: 1, name: "Premium Tobacco", price: 15.00, icon: "fa-leaf" },
    { id: 2, name: "Classic Blend", price: 12.50, icon: "fa-smoking" },
    { id: 3, name: "Menthol Fresh", price: 13.00, icon: "fa-snowflake" },
    { id: 4, name: "Rolling Papers", price: 2.00, icon: "fa-scroll" },
    { id: 5, name: "Filters Pack", price: 1.50, icon: "fa-filter" },
    { id: 6, name: "Lighter", price: 3.00, icon: "fa-fire" }
];

let cart = {};

function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <i class="fas ${product.icon} product-icon"></i>
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="btn-add" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        `;
        grid.appendChild(card);
    });
}

function addToCart(productId) {
    if (!cart[productId]) {
        cart[productId] = 0;
    }
    cart[productId]++;
    updateMainButton();
    
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

function updateMainButton() {
    let totalItems = 0;
    let totalPrice = 0;

    for (const [id, qty] of Object.entries(cart)) {
        const product = products.find(p => p.id == id);
        if (product) {
            totalItems += qty;
            totalPrice += product.price * qty;
        }
    }

    if (totalItems > 0) {
        tg.MainButton.setText(`Оформить заказ: $${totalPrice.toFixed(2)}`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// Handle Main Button click
tg.MainButton.onClick(() => {
    const orderData = {
        items: cart,
        total_price: Object.entries(cart).reduce((sum, [id, qty]) => {
            const p = products.find(prod => prod.id == id);
            return sum + (p ? p.price * qty : 0);
        }, 0)
    };
    
    tg.sendData(JSON.stringify(orderData));
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});
