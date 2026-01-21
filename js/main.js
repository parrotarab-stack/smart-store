// ============================================
// ملف JavaScript الرئيسي للمتجر الذكي
// ============================================

function storeApp() {
    return {
        // === حالة التطبيق ===
        openMenu: false,
        openCart: false,
        openSearch: false,
        selectedCategory: null,
        searchTerm: '',
        searchResults: [],
        
        // === البيانات الأساسية ===
        categories: [],
        products: [],
        cart: [],
        storeSettings: {},
        
        // === تهيئة التطبيق ===
        async init() {
            console.log('🚀 بدء تحميل المتجر الذكي...');
            
            // تحميل جميع البيانات
            await this.loadAllData();
            
            // تحميل السلة والإعدادات
            this.loadCart();
            this.loadSettings();
            
            // تحميل الفئات والمنتجات
            this.loadCategories();
            this.loadProducts();
            
            console.log('✅ تم تحميل المتجر بنجاح');
        },
        
        // === تحميل جميع البيانات ===
        async loadAllData() {
            // التحقق من ضرورة التحميل من السيرفر
            const shouldReload = localStorage.getItem('forceReload') === 'true';
            const lastLoad = localStorage.getItem('lastDataLoad');
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            
            if (shouldReload || !lastLoad || lastLoad < oneDayAgo) {
                console.log('📥 جاري التحميل من السيرفر...');
                await this.loadFromServer();
                localStorage.setItem('lastDataLoad', Date.now());
                localStorage.removeItem('forceReload');
            } else {
                console.log('💾 جاري التحميل من التخزين المحلي...');
                this.loadFromLocalStorage();
            }
        },
        
        // === التحميل من السيرفر ===
        async loadFromServer() {
            try {
                // جلب بيانات db.json
                const response = await fetch('data/db.json');
                if (!response.ok) throw new Error('فشل في تحميل البيانات');
                
                const data = await response.json();
                
                // حفظ البيانات
                this.categories = data.categories || [];
                this.products = data.products || [];
                
                // تخزين محلي
                localStorage.setItem('categories', JSON.stringify(this.categories));
                localStorage.setItem('products', JSON.stringify(this.products));
                
                console.log(`✅ تم تحميل ${this.categories.length} فئة و ${this.products.length} منتج`);
            } catch (error) {
                console.error('❌ خطأ في التحميل:', error);
                this.loadFromLocalStorage();
            }
        },
        
        // === التحميل من التخزين المحلي ===
        loadFromLocalStorage() {
            // الفئات
            const savedCategories = localStorage.getItem('categories');
            if (savedCategories) {
                this.categories = JSON.parse(savedCategories);
            }
            
            // المنتجات
            const savedProducts = localStorage.getItem('products');
            if (savedProducts) {
                this.products = JSON.parse(savedProducts);
            }
            
            // إذا لم تكن هناك بيانات
            if (!savedCategories && !savedProducts) {
                this.loadDefaultData();
            }
        },
        
        // === بيانات افتراضية ===
        loadDefaultData() {
            console.log('📝 تحميل البيانات الافتراضية...');
            
            this.categories = [
                { id: 1, name: 'إلكترونيات', icon: 'fas fa-laptop', color: '#3B82F6' },
                { id: 2, name: 'ملابس', icon: 'fas fa-tshirt', color: '#10B981' },
                { id: 3, name: 'أثاث', icon: 'fas fa-couch', color: '#8B5CF6' },
                { id: 4, name: 'كتب', icon: 'fas fa-book', color: '#F59E0B' },
                { id: 5, name: 'رياضة', icon: 'fas fa-futbol', color: '#EF4444' }
            ];
            
            this.products = [
                {
                    id: 1,
                    name: 'هاتف ذكي',
                    description: 'أحدث هاتف ذكي بكاميرا ممتازة',
                    price: 2500,
                    oldPrice: 3000,
                    discount: 17,
                    image: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=هاتف+ذكي',
                    categoryId: 1,
                    stock: 10
                },
                {
                    id: 2,
                    name: 'كتاب تطوير الويب',
                    description: 'كتاب شامل لتعليم تطوير الويب',
                    price: 120,
                    image: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=كتاب+تطوير',
                    categoryId: 4,
                    stock: 25
                },
                {
                    id: 3,
                    name: 'تيشيرت رياضي',
                    description: 'تيشيرت قطني مريح للرياضة',
                    price: 80,
                    image: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=ملابس+رياضية',
                    categoryId: 2,
                    stock: 15
                }
            ];
            
            // حفظ
            localStorage.setItem('categories', JSON.stringify(this.categories));
            localStorage.setItem('products', JSON.stringify(this.products));
        },
        
        // === تحميل الفئات ===
        loadCategories() {
            const saved = localStorage.getItem('categories');
            this.categories = saved ? JSON.parse(saved) : [];
        },
        
        // === تحميل المنتجات ===
        loadProducts() {
            const saved = localStorage.getItem('products');
            this.products = saved ? JSON.parse(saved) : [];
        },
        
        // === تحميل السلة ===
        loadCart() {
            const saved = localStorage.getItem('cart');
            this.cart = saved ? JSON.parse(saved) : [];
        },
        
        // === حفظ السلة ===
        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        
        // === تحميل الإعدادات ===
        loadSettings() {
            const saved = localStorage.getItem('settings');
            if (saved) {
                this.storeSettings = JSON.parse(saved);
            } else {
                // إعدادات افتراضية
                this.storeSettings = {
                    storeName: 'المتجر الذكي',
                    storeDescription: 'متجرك الإلكتروني المفضل',
                    storeAddress: 'القاهرة، مصر',
                    storePhone: '+20123456789',
                    currency: 'ج.م',
                    taxRate: 14,
                    shippingCost: 30
                };
                localStorage.setItem('settings', JSON.stringify(this.storeSettings));
            }
        },
        
        // === البحث ===
        performSearch() {
            if (!this.searchTerm.trim()) {
                this.searchResults = [];
                return;
            }
            
            const term = this.searchTerm.toLowerCase();
            this.searchResults = this.products.filter(p =>
                p.name.toLowerCase().includes(term) ||
                (p.description && p.description.toLowerCase().includes(term)) ||
                (p.categoryId && this.getCategoryName(p.categoryId).toLowerCase().includes(term))
            ).slice(0, 8);
        },
        
        // === اختيار نتيجة بحث ===
        selectSearchItem(item) {
            this.openSearch = false;
            this.searchTerm = '';
            // يمكن إضافة سلوك مثل إظهار تفاصيل المنتج
            alert(`تم اختيار: ${item.name}`);
        },
        
        // === المنتجات المصفاة ===
        get filteredProducts() {
            if (this.selectedCategory === null) {
                return this.products;
            }
            return this.products.filter(p => p.categoryId === this.selectedCategory);
        },
        
        // === عد المنتجات في الفئة ===
        countProductsInCategory(categoryId) {
            return this.products.filter(p => p.categoryId === categoryId).length;
        },
        
        // === اسم الفئة ===
        getCategoryName(categoryId) {
            const category = this.categories.find(c => c.id === categoryId);
            return category ? category.name : 'غير مصنف';
        },
        
        // === إضافة إلى السلة ===
        addToCart(product) {
            // التحقق من التوفر
            if (!product.stock || product.stock <= 0) {
                alert('عذراً، هذا المنتج غير متوفر حالياً');
                return;
            }
            
            // البحث عن المنتج في السلة
            const existing = this.cart.find(item => item.id === product.id);
            
            if (existing) {
                // التحقق من عدم تجاوز المخزون
                if (existing.quantity >= product.stock) {
                    alert('لا يمكن إضافة كمية أكثر من المتاح');
                    return;
                }
                existing.quantity++;
            } else {
                // إضافة منتج جديد
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    price: this.calculatePrice(product),
                    image: product.image,
                    quantity: 1,
                    product: product
                });
            }
            
            // حفظ وتحديث
            this.saveCart();
            this.showNotification('تمت الإضافة إلى السلة ✓');
        },
        
        // === تحديث كمية السلة ===
        updateCartItem(productId, change) {
            const item = this.cart.find(i => i.id === productId);
            if (!item) return;
            
            const newQty = item.quantity + change;
            
            // التحقق من الحد الأدنى
            if (newQty < 1) {
                this.removeFromCart(productId);
                return;
            }
            
            // التحقق من المخزون
            const product = this.products.find(p => p.id === productId);
            if (product && newQty > product.stock) {
                alert('الكمية المطلوبة غير متوفرة في المخزون');
                return;
            }
            
            item.quantity = newQty;
            this.saveCart();
        },
        
        // === إزالة من السلة ===
        removeFromCart(productId) {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveCart();
            this.showNotification('تم الإزالة من السلة ✗');
        },
        
        // === حساب السعر بعد الخصم ===
        calculatePrice(product) {
            if (product.discount && product.discount > 0) {
                return product.price - (product.price * product.discount / 100);
            }
            return product.price;
        },
        
        // === تنسيق السعر ===
        formatPrice(price) {
            if (!price) return '٠٫٠٠';
            return price.toLocaleString('ar-EG') + ' ' + (this.storeSettings.currency || 'ج.م');
        },
        
        // === عدد العناصر في السلة ===
        getCartCount() {
            return this.cart.reduce((total, item) => total + item.quantity, 0);
        },
        
        // === إجمالي السلة ===
        getCartTotal() {
            return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        
        // === إتمام الشراء ===
        checkout() {
            if (this.cart.length === 0) {
                alert('السلة فارغة');
                return;
            }
            
            const total = this.getCartTotal();
            const shipping = this.storeSettings.shippingCost || 0;
            const tax = (total * (this.storeSettings.taxRate || 0)) / 100;
            const finalTotal = total + shipping + tax;
            
            const summary = `
                📋 ملخص الطلب:
                المنتجات: ${this.formatPrice(total)}
                الشحن: ${this.formatPrice(shipping)}
                الضريبة: ${this.formatPrice(tax)}
                المجموع: ${this.formatPrice(finalTotal)}
                
                هل تريد إتمام الشراء؟
            `;
            
            if (confirm(summary)) {
                // هنا يمكن إضافة كود إرسال الطلب للسيرفر
                alert('🎉 شكراً لشرائك! تم استلام طلبك وسيتم التواصل معك قريباً.');
                this.cart = [];
                this.saveCart();
                this.openCart = false;
            }
        },
        
        // === إشعار ===
        showNotification(message) {
            // إنشاء عنصر الإشعار
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce-in';
            notification.textContent = message;
            notification.style.cssText = `
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2s forwards;
                font-weight: bold;
            `;
            
            // إضافة أنماط CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            // إضافة للصفحة
            document.body.appendChild(notification);
            
            // إزالة بعد 2.5 ثانية
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 2500);
        },
        
        // === تصدير البيانات ===
        exportData() {
            const data = {
                categories: this.categories,
                products: this.products,
                settings: this.storeSettings,
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `متجر_ذكي_نسخة_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };
}

// === تهيئة Alpine.js عند تحميل الصفحة ===
document.addEventListener('alpine:init', () => {
    Alpine.data('storeApp', storeApp);
});
