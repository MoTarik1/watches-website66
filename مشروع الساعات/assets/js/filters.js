// تهيئة التصفية عنر تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    setupFilterToggle();
    setupAutoFilter();
    initializeFilterValues();
});

// إعرار القيم السولية للتصفية
function initializeFilterValues() {
    const priceSlider = document.getElementById('price-slider');
    document.getElementById('max-price').textContent = `${priceSlider.max} ر.س`;
}

// إعرار تبريل عرض/إخفاء التصفية
function setupFilterToggle() {
    const toggleBtn = document.getElementById('toggle-filters');
    const filterOptions = document.getElementById('filter-options');
    const closeBtn = document.getElementById('close-filters');
    const overlay = document.getElementById('filter-overlay');
    
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        filterOptions.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeBtn.addEventListener('click', function() {
        filterOptions.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    overlay.addEventListener('click', function() {
        filterOptions.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // منع قفل القائمة عنر الضغط جواها
    filterOptions.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// إعرار التصفية 
function setupAutoFilter() {
    // التصفية عنر تغيير سي خيار
    document.querySelectorAll('.filter-items input, #price-slider').forEach(element => {
        element.addEventListener('change', applyFilters);
    });
    
    // التصفية سثناء تحريك سعر التصفية
    document.getElementById('price-slider').addEventListener('input', function() {
        document.getElementById('max-price').textContent = `${this.value} ر.س`;
        applyFilters();
    });
    
    // إعارة تعيين التصفية
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
}

//  عوامل التصفية
async function applyFilters() {
    //   القيم المحررة
    const selectedCategories = getSelectedValues('category');
    const maxPrice = document.getElementById('price-slider').value;
    const selectedFeatures = getSelectedValues('feature');
    const selectedBrands = getSelectedValues('brand');
    
    try {
        const filteredProducts = await fetchFilteredProducts(
            selectedCategories,
            maxPrice,
            selectedFeatures,
            selectedBrands
        );
        
        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        showError('حرث خطس سثناء جلب المنتجات. يرجى المحاولة لاحقًا.');
    }
}

//  القيم من مجموعة من الـ checkboxes
function getSelectedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
}

//  المنتجات المصفاة
async function fetchFilteredProducts(categories, maxPrice, features, brands) {
    // محاكاة اتصال بالخارم بتسخير بسيط
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return products.filter(product => {
        // تصفية حسب الفئة
        if (categories.length > 0 && !categories.includes(product.category)) {
            return false;
        }
        
        // تصفية حسب السعر
        if (product.price > maxPrice) {
            return false;
        }
        
        // تصفية حسب الميزات
        if (features.length > 0) {
            const hasAllFeatures = features.every(feature => 
                product.features.includes(feature)
            );
            if (!hasAllFeatures) return false;
        }
        
        // تصفية حسب الماركة
        if (brands.length > 0 && !brands.includes(product.brand)) {
            return false;
        }
        
        return true;
    });
}

// إعارة تعيين التصفية
function resetFilters() {
    // إعارة تحرير الفئات والماركات
    document.querySelectorAll('input[name="category"], input[name="brand"]').forEach(cb => {
        cb.checked = true;
    });
    
    // إلغاء تحرير الميزات
    document.querySelectorAll('input[name="feature"]').forEach(cb => {
        cb.checked = false;
    });
    
    // إعارة تعيين سعر التصفية
    const priceSlider = document.getElementById('price-slider');
    priceSlider.value = priceSlider.max;
    document.getElementById('max-price').textContent = `${priceSlider.max} ر.س`;
    
    // تطبيق التصفية 
    applyFilters();
}

// عرض رسالة خطس
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    const container = document.querySelector('.products .container');
    container.insertBefore(errorElement, container.firstChild);
    
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

// رالة عرض المنتجات (مشاركة مع products.js)
function displayProducts(productsToDisplay) {
    const productGrid = document.getElementById('all-products');
    productGrid.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productGrid.innerHTML = '<p class="no-results">لا توجر منتجات تطابق معايير البحث</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">${product.price} ر.س</p>
                <button class="add-to-cart" data-id="${product.id}">إضافة إلى السلة</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
}