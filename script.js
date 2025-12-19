// ... (предыдущий код без изменений, обновляем только рендеринг кнопок)

function renderProducts() {
    const grid = document.getElementById('products-grid');
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

// ... (остальной код такой же)
