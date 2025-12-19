// Init Telegram Web App safely
const tg = window.Telegram?.WebApp || {};

// Expand if available
if (tg.expand) { tg.expand(); }

// Check for color scheme
if (tg.colorScheme === 'dark') { document.body.classList.add('dark-mode'); }

// Mock Data
const products = [
    { id: 1, name: "Premium Tobacco", price: 15.00, icon: "fa-leaf" },
    { id: 2, name: "Classic Blend", price: 12.50, icon: "fa-smoking" },
    { id: 3, name: "Menthol Fresh", price: 13.00, icon: "fa-snowflake" },
    { id: 4, name: "Rolling Papers", price: 2.00, icon: "fa-scroll" },
    { id: 5, name: "Filters Pack", price: 1.50, icon: "fa-filter" },
    { id: 6, name: "Gold Lighter", price: 3.00, icon: "fa-fire" },
    { id: 7, name: "Cigar Cutter", price: 5.50, icon: "fa-scissors" },
    { id: 8, name: "Ash Tray", price: 8.00, icon: "fa-circle-notch" }
];

let cart = {};

// --- Simple Modal Logic (no validation) ---
function switchTab(tab) {
    const shopView = document.getElementById('view-shop');
    const cartView = document.getElementById('view-cart');
    const tabs = document.querySelectorAll('.tabbar .tab');
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    if (shopView) shopView.classList.toggle('active', tab === 'shop');
    if (cartView) cartView.classList.toggle('active', tab === 'cart');
}

// --- Product Logic ---

function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';

    products.forEach((product, index) => {
        const qty = cart[product.id] || 0;
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.05}s`;
        card.innerHTML = `
            <div class="product-image-placeholder">
                <i class="fas ${product.icon} product-icon"></i>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
            <div class="action-area">
                ${renderButtonState(product.id, qty)}
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderButtonState(id, qty) {
    if (qty === 0) {
        return `<button class="btn-add-text" onclick="updateCart(${id}, 1)">ДОБАВИТЬ</button>`;
    } else {
        return `
            <div class="counter-container">
                <button class="btn-circle btn-minus" onclick="updateCart(${id}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="item-count">${qty}</span>
                <button class="btn-circle btn-plus" onclick="updateCart(${id}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
    }
}

// Make updateCart globally available
window.updateCart = function(id, change) {
    if (!cart[id]) cart[id] = 0;
    cart[id] += change;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    renderProducts();
    renderCartView();
    updateMainButton();
    
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(change > 0 ? 'medium' : 'light');
    }
};

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

    if (totalItems > 0 && tg.MainButton) {
        tg.MainButton.setText(`Оформить заказ (${totalItems} шт.) - $${totalPrice.toFixed(2)}`);
        tg.MainButton.show();
        tg.MainButton.enable();
        if (tg.themeParams) {
             tg.MainButton.color = tg.themeParams.button_color || "#000000";
             tg.MainButton.textColor = tg.themeParams.button_text_color || "#ffffff";
        } else {
             tg.MainButton.color = "#000000";
             tg.MainButton.textColor = "#ffffff";
        }
    } else if (tg.MainButton) {
        tg.MainButton.hide();
    }
}

if (tg.MainButton) {
    tg.MainButton.onClick(() => {
        const orderData = {
            items: cart,
            total_price: Object.entries(cart).reduce((sum, [id, qty]) => {
                const p = products.find(prod => prod.id == id);
                return sum + (p ? p.price * qty : 0);
            }, 0)
        };
        
        if (tg.sendData) {
            tg.sendData(JSON.stringify(orderData));
        } else {
            alert("Order data: " + JSON.stringify(orderData));
        }
    });
}

function renderCartView() {
    const list = document.getElementById('cart-list');
    const totalEl = document.getElementById('cart-total');
    if (!list || !totalEl) return;
    list.innerHTML = '';
    let total = 0;
    Object.entries(cart).forEach(([id, qty]) => {
        const p = products.find(prod => prod.id == id);
        if (!p) return;
        total += p.price * qty;
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `<span class="cart-name">${p.name}</span><span class="cart-qty">x${qty}</span><span class="cart-price">$${(p.price*qty).toFixed(2)}</span>`;
        list.appendChild(item);
    });
    totalEl.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCartView();
    switchTab('shop');
    document.querySelectorAll('.tabbar .tab').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
});
