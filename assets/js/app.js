// Store Application
const store = {
    // State
    sidebarOpen: false,
    cartOpen: false,
    searchOpen: false,
    selectedCategory: null,
    searchQuery: '',
    searchResults: [],
    
    // Data
    categories: [],
    products: [],
    cart: [],
    settings: {},
    
    // Initialize
    async init() {
        console.log('🚀 المتجر الذكي - بدء التشغيل...');
        
        // Load data
        await this.loadData();
        
        // Load cart
        this.loadCart();
        
        // Load settings
        this.loadSettings();
        
        console.log('✅ التهيئة اكتملت');
    },
    
    // Load data from server or localStorage
    async loadData() {
        // Check if we should reload from server
        const forceReload = localStorage.getItem('forceReload') === 'true';
        
        if (forceReload || !localStorage.getItem('products')) {
            console.log('📥 جاري التحميل من السيرفر...');
            await this.loadFromServer();
            localStorage.removeItem('forceReload');
        } else {
            console.log('💾 جاري التحميل من التخزين المحلي...');
            this.loadFromLocalStorage();
        }
    },
    
    // Load from server
    async loadFromServer() {
        try {
            const response = await fetch('assets/js/db.json');
            if (!response.ok) throw new Error('فشل في تحميل البيانات');
            
            const data = await response.json();
            
            this.categories = data.categories || [];
            this.products = data.products || [];
            
            // Save to localStorage
            localStorage.setItem('categories', JSON.stringify(this.categories));
            localStorage.setItem('products', JSON.stringify(this.products));
            
            console.log(`✅ تم تحميل ${this.categories.length} فئة و ${this.products.length} منتج`);
        } catch (error) {
            console.error('❌ خطأ في تحميل البيانات:', error);
            this.loadFromLocalStorage();
        }
    },
    
    // Load from localStorage
    loadFromLocalStorage() {
        const savedCategories = localStorage.getItem('categories');
        const savedProducts = localStorage.getItem('products');
        
        if (savedCategories) {
            this.categories = JSON.parse(savedCategories);
        }
        
        if (savedProducts) {
            this.products = JSON.parse(savedProducts);
        }
        
        // If no data, load sample data
        if (!savedCategories && !savedProducts) {
            this.loadSampleData();
        }
    },
    
    // Load sample data
    loadSampleData() {
        this.categories = [
            { id: 1, name: 'إلكترونيات', icon: 'fas fa-laptop' },
            { id: 2, name: 'ملابس', icon: 'fas fa-tshirt' },
            { id: 3, name: 'أثاث', icon: 'fas fa-couch' },
            { id: 4, name: 'كتب', icon: 'fas fa-book' }
        ];
        
        this.products = [
            {
                id: 1,
                name: 'هاتف ذكي حديث',
                description: 'هاتف ذكي بكاميرا ممتازة وذاكرة كبيرة',
                price: 2500,
                oldPrice: 3000,
                discount: 17,
                image: '',
                categoryId: 1,
                stock: 15
            },
            {
                id: 2,
                name: 'كتاب برمجة الويب',
                description: 'كتاب شامل لتعلم برمجة الويب من الصفر',
                price: 120,
                image: '',
                categoryId: 4,
                stock: 25
            },
            {
                id: 3,
                name: 'تيشيرت رياضي',
                description: 'تيشيرت قطني مريح للرياضة اليومية',
                price: 80,
                image: '',
                categoryId: 2,
                stock: 30
            },
            {
                id: 4,
                name: 'طاولة مكتب',
                description: 'طاولة مكتب خشبية عالية الجودة',
                price: 850,
                image: '',
                categoryId: 3,
                stock: 8
            }
        ];
        
        localStorage.setItem('categories', JSON.stringify(this.categories));
        localStorage.setItem('products', JSON.stringify(this.products));
        
        console.log('📝 تم تحميل البيانات الافتراضية');
    },
    
    // Get product image URL
    getProductImage(product) {
        if (product.image && product.image.startsWith('http')) {
            return product.image;
        }
        // Generate placeholder image
        const colors = ['3B82F6', '10B981', '8B5CF6', 'F59E0B', 'EF4444'];
        const color = colors[product.id % colors.length];
        const text = encodeURIComponent(product.name.substring(0, 15));
        return `https://placehold.co/300x200/${color}/FFFFFF?text=${text}`;
    },
    
    // Load cart
    loadCart() {
        const savedCart = localStorage.getItem('cart');
        this.cart = savedCart ? JSON.parse(savedCart) : [];
    },
    
    // Save cart
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    
    // Load settings
    loadSettings() {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        } else {
            this.settings = {
                storeName: 'المتجر الذكي',
                storeDescription: 'متجرك الإلكتروني المفضل',
                storeAddress: 'القاهرة، مصر',
                storePhone: '+20123456789',
                currency: 'ج.م',
                taxRate: 14
            };
            localStorage.setItem('settings', JSON.stringify(this.settings));
        }
    },
    
    // Save settings
    saveSettings() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
    },
    
    // Filtered products
    get filteredProducts() {
        if (this.selectedCategory === null) {
            return this.products;
        }
        return this.products.filter(p => p.categoryId === this.selectedCategory);
    },
    
    // Count products in category
    countProductsInCategory(categoryId) {
        return this.products.filter(p => p.categoryId === categoryId).length;
    },
    
    // Calculate price with discount
    calculatePrice(product) {
        if (product.discount > 0) {
            return Math.round(product.price - (product.price * product.discount / 100));
        }
        return product.price;
    },
    
    // Format price
    formatPrice(price) {
        if (!price) return '0 ج.م';
        return price.toLocaleString('ar-EG') + ' ج.م';
    },
    
    // Add to cart
    addToCart(product) {
        if (product.stock === 0) {
            this.showNotification('هذا المنتج غير متوفر', 'error');
            return;
        }
        
        const existing = this.cart.find(item => item.id === product.id);
        
        if (existing) {
            // Check stock
            const productInStock = this.products.find(p => p.id === product.id);
            if (existing.quantity >= productInStock.stock) {
                this.showNotification('لا يمكن إضافة كمية أكثر من المتاح', 'warning');
                return;
            }
            existing.quantity++;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: this.calculatePrice(product),
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showNotification('تم إضافة المنتج إلى السلة', 'success');
    },
    
    // Update cart item quantity
    updateCart(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;
        
        const newQty = item.quantity + change;
        
        if (newQty < 1) {
            this.removeFromCart(productId);
            return;
        }
        
        // Check stock
        const product = this.products.find(p => p.id === productId);
        if (product && newQty > product.stock) {
            this.showNotification('الكمية المطلوبة غير متوفرة', 'warning');
            return;
        }
        
        item.quantity = newQty;
        this.saveCart();
    },
    
    // Remove from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.showNotification('تم إزالة المنتج من السلة', 'info');
    },
    
    // Search products
    searchProducts() {
        if (!this.searchQuery.trim()) {
            this.searchResults = [];
            return;
        }
        
        const query = this.searchQuery.toLowerCase();
        this.searchResults = this.products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            (product.description && product.description.toLowerCase().includes(query))
        ).slice(0, 5);
    },
    
    // Checkout
    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('السلة فارغة', 'warning');
            return;
        }
        
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = total * ((this.settings.taxRate || 0) / 100);
        const finalTotal = total + tax;
        
        const summary = `
            📋 ملخص الطلب:
            
            المنتجات: ${this.formatPrice(total)}
            الضريبة (${this.settings.taxRate || 0}%): ${this.formatPrice(tax)}
            المجموع النهائي: ${this.formatPrice(finalTotal)}
            
            هل تريد إتمام الشراء؟
        `;
        
        if (confirm(summary)) {
            // في الواقع، هنا يجب إرسال الطلب للسيرفر
            this.showNotification('شكراً لشرائك! تم استلام طلبك بنجاح 🎉', 'success');
            this.cart = [];
            this.saveCart();
            this.cartOpen = false;
        }
    },
    
    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        
        // Set type-based styling
        const typeStyles = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        notification.className = `fixed top-4 right-4 ${typeStyles[type] || 'bg-blue-500'} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
        notification.textContent = message;
        notification.style.cssText = `
            animation: notificationSlideIn 0.3s ease, notificationFadeOut 0.3s ease 2s forwards;
            font-weight: bold;
            min-width: 300px;
            text-align: center;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 2.5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2500);
    }
};

// Initialize Alpine.js
document.addEventListener('alpine:init', () => {
    Alpine.data('store', () => store);
});

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes notificationSlideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes notificationFadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Export for debugging
window.smartStore = store;
