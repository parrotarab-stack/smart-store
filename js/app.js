// تطبيق المتجر الرئيسي
const StoreApp = {
    // التهيئة
    init: function() {
        this.loadCategories();
        this.loadProducts();
        this.setupEventListeners();
        Cart.init();
    },
    
    // تحميل الفئات
    loadCategories: function() {
        const categories = [
            { id: 1, name: 'إلكترونيات', icon: 'fas fa-laptop', color: '#3b82f6' },
            { id: 2, name: 'ملابس', icon: 'fas fa-tshirt', color: '#10b981' },
            { id: 3, name: 'أدوات منزلية', icon: 'fas fa-home', color: '#f59e0b' },
            { id: 4, name: 'كتب', icon: 'fas fa-book', color: '#8b5cf6' },
            { id: 5, name: 'ألعاب', icon: 'fas fa-gamepad', color: '#ef4444' },
            { id: 6, name: 'عطور', icon: 'fas fa-spray-can', color: '#ec4899' },
            { id: 7, name: 'أجهزة', icon: 'fas fa-mobile-alt', color: '#06b6d4' },
            { id: 8, name: 'طعام', icon: 'fas fa-utensils', color: '#84cc16' }
        ];
        
        this.displayCategories(categories);
        this.populateCategoryFilter(categories);
    },
    
    // عرض الفئات
    displayCategories: function(categories) {
        const container = document.getElementById('categories-container');
        
        container.innerHTML = categories.map(category => `
            <a href="category-products.html?id=${category.id}" class="category-card">
                <div class="category-icon" style="background: ${category.color}">
                    <i class="${category.icon}"></i>
                </div>
                <div class="category-name">${category.name}</div>
                <div class="product-count">12 منتج</div>
            </a>
        `).join('');
    },
    
    // تعبئة فلتر الفئات
    populateCategoryFilter: function(categories) {
        const select = document.getElementById('category-filter');
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    },
    
    // تحميل المنتجات
    loadProducts: function() {
        // منتجات افتراضية
        const products = [
            {
                id: 1,
                name: 'هاتف سامسونج جالكسي',
                categoryId: 1,
                price: 5000,
                stock: 10,
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
                description: 'هاتف ذكي بشاشة 6.5 بوصة، كاميرا 48 ميجابكسل',
                featured: true
            },
            {
                id: 2,
                name: 'تيشيرت رجالي قطن',
                categoryId: 2,
                price: 150,
                stock: 25,
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
                description: 'تيشيرت قطن 100%، متوفر بألوان متعددة',
                featured: true
            },
            {
                id: 3,
                name: 'كتاب تطوير الويب',
                categoryId: 4,
                price: 200,
                stock: 15,
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w-400&h=300&fit=crop',
                description: 'كتاب شامل لتعليم تطوير الويب للمبتدئين',
                featured: true
            },
            {
                id: 4,
                name: 'عطر رجالي فاخر',
                categoryId: 6,
                price: 300,
                stock: 8,
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop',
                description: 'عطر رجالي فاخر برائحة مميزة',
                featured: true
            }
        ];
        
        this.displayProducts(products);
    },
    
    // عرض المنتجات
    displayProducts: function(products) {
        const container = document.getElementById('products-container');
        
        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1">
                    <i class="fas fa-box-open"></i>
                    <h3>لا توجد منتجات</h3>
                    <p>لم يتم العثور على منتجات تطابق بحثك</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = products.map(product => `
            <div class="product-card">
                ${product.featured ? '<div class="featured-badge">مميز</div>' : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <div class="product-category">إلكترونيات</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price.toLocaleString()} ج.م</div>
                    <div class="product-stock ${product.stock > 0 ? 'stock-in' : 'stock-out'}">
                        <i class="fas ${product.stock > 0 ? 'fa-check' : 'fa-times'}"></i>
                        ${product.stock > 0 ? `متوفر (${product.stock})` : 'نفذ من المخزون'}
                    </div>
                    <button class="btn btn-primary btn-block mt-2" onclick="Cart.addToCart(${product.id})" 
                            ${product.stock <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> أضف للسلة
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    // إعداد المستمعين للأحداث
    setupEventListeners: function() {
        // البحث
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            this.searchProducts(e.target.value);
        });
        
        // الفلاتر
        document.getElementById('category-filter').addEventListener('change', this.filterProducts.bind(this));
        document.getElementById('sort-filter').addEventListener('change', this.sortProducts.bind(this));
    },
    
    // بحث المنتجات
    searchProducts: function(query) {
        // سيتم تنفيذ البحث الحقيقي هنا
        console.log('بحث عن:', query);
    },
    
    // فلترة المنتجات
    filterProducts: function() {
        const categoryId = document.getElementById('category-filter').value;
        console.log('فلترة حسب الفئة:', categoryId);
    },
    
    // ترتيب المنتجات
    sortProducts: function() {
        const sortBy = document.getElementById('sort-filter').value;
        console.log('ترتيب حسب:', sortBy);
    },
    
    // عرض التنبيه
    showAlert: function(message, type = 'success') {
        const container = document.getElementById('alert-container');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="close-modal" onclick="this.parentElement.remove()" style="margin-right: auto;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(alert);
        
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }
};

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    StoreApp.init();
});