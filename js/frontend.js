// ملف لمعالجة واجهة المتجر الأمامية
const FrontendStore = {
    // 1. تحميل المنتجات حسب الفئة
    loadProductsByCategory: function(categoryId = null) {
        const products = SmartStoreDB.get('products');
        const categories = SmartStoreDB.get('categories');
        
        let filteredProducts = products;
        
        if (categoryId) {
            filteredProducts = products.filter(p => p.categoryId == categoryId);
        } else {
            // عرض المنتجات المميزة فقط في الصفحة الرئيسية
            filteredProducts = products.filter(p => p.featured);
        }
        
        return this.displayProducts(filteredProducts, categories);
    },
    
    // 2. عرض المنتجات
    displayProducts: function(products, categories) {
        if (products.length === 0) {
            return '<p style="text-align: center; color: #666; grid-column: 1 / -1;">لا توجد منتجات حالياً</p>';
        }
        
        return products.map(product => {
            const category = categories.find(c => c.id === product.categoryId);
            const stockClass = product.stock > 0 ? 'in-stock' : 'out-of-stock';
            const stockText = product.stock > 0 ? `متوفر (${product.stock})` : 'نفذ من المخزون';
            
            return `
                <div class="product-card" onclick="FrontendStore.viewProduct(${product.id})" style="cursor: pointer;">
                    <div class="product-image">
                        ${product.featured ? '<span class="featured-badge">🛒 متوفر للطلب</span>' : ''}
                        <img src="${ImageManager.getImageUrl(product.image)}" alt="${product.name}">
                        <div class="quick-view" style="position: absolute; bottom: -50px; left: 0; right: 0; background: rgba(0,0,0,0.8); color: white; padding: 10px; text-align: center; transition: 0.3s; opacity: 0;">
                            <i class="fas fa-eye"></i> عرض المنتج
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-category">${category?.name || 'عام'}</div>
                        <h3 class="product-name">${product.name}</h3>
                        <p style="font-size: 14px; color: #666; margin-bottom: 10px; flex-grow: 1;">
                            ${product.description ? (product.description.length > 60 ? product.description.substring(0, 60) + '...' : product.description) : 'لا يوجد وصف'}
                        </p>
                        <div class="product-price">${product.price.toLocaleString('ar-EG')} ج.م</div>
                        <div class="stock ${stockClass}" style="margin-top: 10px;">
                            <i class="fas fa-${product.stock > 0 ? 'check' : 'times'}"></i> ${stockText}
                        </div>
                        <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})" 
                                ${product.stock <= 0 ? 'disabled style="background: #95a5a6;"' : ''}
                                style="margin-top: 15px; width: 100%;">
                            <i class="fas fa-cart-plus"></i> أضف للسلة
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // 3. عرض الفئات
    displayCategories: function() {
        const categories = SmartStoreDB.get('categories');
        const products = SmartStoreDB.get('products');
        
        return categories.map(category => {
            const productCount = products.filter(p => p.categoryId === category.id).length;
            
            return `
                <div class="category-card" onclick="window.location.href='category-products.html?id=${category.id}'">
                    <div class="category-icon">
                        <i class="fas ${category.icon || 'fa-folder'}"></i>
                    </div>
                    <h3 style="font-size: 16px; margin-bottom: 5px;">${category.name}</h3>
                    <p style="color: #666; font-size: 14px;">${productCount} منتج</p>
                </div>
            `;
        }).join('');
    },
    
    // 4. عرض صفحة تفاصيل المنتج
    viewProduct: function(productId) {
        window.location.href = `product-details.html?id=${productId}`;
    },
    
    // 5. تحميل تفاصيل منتج معين
    loadProductDetails: function(productId) {
        const product = SmartStoreDB.get('products').find(p => p.id == productId);
        const categories = SmartStoreDB.get('categories');
        const category = categories.find(c => c.id === product?.categoryId);
        
        if (!product) {
            return {
                html: '<div style="text-align: center; padding: 50px;"><h3>المنتج غير موجود</h3></div>',
                product: null
            };
        }
        
        const stockClass = product.stock > 0 ? 'in-stock' : 'out-of-stock';
        const stockText = product.stock > 0 ? `متوفر (${product.stock})` : 'نفذ من المخزون';
        
        const html = `
            <div class="product-details">
                <div class="product-gallery">
                    <img src="${ImageManager.getImageUrl(product.image)}" alt="${product.name}">
                </div>
                <div class="product-content">
                    <nav style="margin-bottom: 20px;">
                        <a href="index.html" style="color: #666; text-decoration: none;">الرئيسية</a>
                        <span style="margin: 0 10px;">/</span>
                        <a href="category-products.html?id=${category?.id}" style="color: #666; text-decoration: none;">${category?.name || 'عام'}</a>
                        <span style="margin: 0 10px;">/</span>
                        <span>${product.name}</span>
                    </nav>
                    
                    <h1 style="font-size: 28px; margin-bottom: 15px; color: #2c3e50;">${product.name}</h1>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                        <div class="product-category" style="font-size: 16px;">
                            <i class="fas fa-folder"></i> ${category?.name || 'عام'}
                        </div>
                        <div class="stock ${stockClass}" style="margin-top: 10px; font-size: 16px;">
                            <i class="fas fa-${product.stock > 0 ? 'check' : 'times'}"></i> ${stockText}
                        </div>
                    </div>
                    
                    <div class="price-section">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <h3 style="color: #e74c3c; font-size: 32px; margin: 0;">
                                    ${product.price.toLocaleString('ar-EG')} ج.م
                                </h3>
                                ${product.originalPrice ? `
                                    <div style="display: flex; align-items: center; margin-top: 5px;">
                                        <span class="original-price">${product.originalPrice.toLocaleString('ar-EG')} ج.م</span>
                                        ${product.discountPercent ? `
                                            <span class="discount-percent">${product.discountPercent}% خصم</span>
                                        ` : ''}
                                    </div>
                                ` : ''}
                            </div>
                            <button class="btn btn-primary" onclick="addToCart(${product.id})" 
                                    ${product.stock <= 0 ? 'disabled style="background: #95a5a6;"' : ''}
                                    style="padding: 15px 30px; font-size: 18px;">
                                <i class="fas fa-cart-plus"></i> أضف للسلة
                            </button>
                        </div>
                    </div>
                    
                    <div style="margin-top: 30px;">
                        <h3 style="color: #2c3e50; margin-bottom: 15px;">
                            <i class="fas fa-info-circle"></i> وصف المنتج
                        </h3>
                        <p style="line-height: 1.8; color: #555; font-size: 16px;">
                            ${product.description || 'لا يوجد وصف مفصل للمنتج.'}
                        </p>
                    </div>
                    
                    ${product.specifications ? `
                        <div style="margin-top: 30px;">
                            <h3 style="color: #2c3e50; margin-bottom: 15px;">
                                <i class="fas fa-list"></i> المواصفات
                            </h3>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                                ${product.specifications}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        return { html, product };
    },
    
    // 6. البحث عن منتجات
    searchProducts: function(query) {
        const results = SmartStoreDB.searchProducts(query);
        const categories = SmartStoreDB.get('categories');
        
        return {
            results: results,
            html: this.displayProducts(results, categories)
        };
    },
    
    // 7. تحميل منتجات الفئة
    loadCategoryProducts: function(categoryId) {
        const products = SmartStoreDB.get('products').filter(p => p.categoryId == categoryId);
        const categories = SmartStoreDB.get('categories');
        const category = categories.find(c => c.id == categoryId);
        
        return {
            category: category,
            products: products,
            html: this.displayProducts(products, categories)
        };
    }
};