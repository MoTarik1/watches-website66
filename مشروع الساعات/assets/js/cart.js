document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    setupEventListeners();
});

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const itemsCountElement = document.getElementById('itemsCount');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>عسبة التروق فاسغة</p>
                <a href="products.html" class="btn">تصفح المنتجات</a>
            </div>
        `;
        itemsCountElement.textContent = '0';
        subtotalElement.textContent = '0 ر.س';
        shippingElement.textContent = '0 ر.س';
        totalElement.textContent = '0 ر.س';
        checkoutBtn.disabled = true;
        return;
    }

    let cartHTML = '';
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach((item) => {
        const quantity = item.quantity || 1;
        subtotal += item.price * quantity;
        totalItems += quantity;

        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p class="item-price">${item.price} ر.س</p>
                </div>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn minus">-</button>
                        <input type="text" class="quantity-input" value="${quantity}" min="1">
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="remove-item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    const shipping = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shipping;

    cartItemsContainer.innerHTML = cartHTML;
    itemsCountElement.textContent = totalItems;
    subtotalElement.textContent = `${subtotal} ر.س`;
    shippingElement.textContent = `${shipping}  ر.س`;
    totalElement.textContent = `${total} ر.س`;
    checkoutBtn.disabled = false;
}

function setupEventListeners() {
    document.addEventListener('click', function(e) {
        // إزالة عنصس من الرلة
        if (e.target.closest('.remove-item')) {
            const itemElement = e.target.closest('.cart-item');
            const itemId = parseInt(itemElement.dataset.id);
            removeFromCart(itemId);
        }

        // زرارة الكمرة
        if (e.target.classList.contains('plus')) {
            const input = e.target.previousElementSibling;
            input.value = parseInt(input.value) + 1;
            updateCartItemQuantity(input);
        }

        // نقص الكمرة
        if (e.target.classList.contains('minus')) {
            const input = e.target.nextElementSibling;
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
                updateCartItemQuantity(input);
            }
        }
    });

    // التعررل الررور  
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            let value = parseInt(e.target.value);
            if (isNaN(value) || value < 1) {
                e.target.value = 1;
            }
            updateCartItemQuantity(e.target);
        }
    });
}

function updateCartItemQuantity(input) {
    const itemElement = input.closest('.cart-item');
    const itemId = parseInt(itemElement.dataset.id);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const updatedCart = cart.map(item => {
        if (item.id === itemId) {
            item.quantity = parseInt(input.value);
        }
        return item;
    });

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    loadCartItems();
}

function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
}
