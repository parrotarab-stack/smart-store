// إدارة سلة التسوق
const Cart = {
    // التهيئة
    init: function() {
        this.loadCart();
        this.updateCartCount();
    },
    
    // تحميل السلة
    loadCart: function() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    },
    
    // حفظ السلة
    saveCart: function() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    // تحديث عدد العناصر
    updateCartCount: function() {
        const total = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const countElement = document.getElementById('cart-count');
        
        if (countElement) {
            countElement.textContent = total;
            countElement.style.display = total > 0 ? 'flex' : 'none';
        }
    },
    
    // إضافة منتج للسلة
    addToCart: function(productId) {
        // جلب المنتج من قاعدة البيانات
        const product = this.getProductById(productId);
        
        if (!product) {
            StoreApp.showAlert('المنتج غير موجود', 'error');
            return;
        }
        
        if (product.stock <= 0) {
            StoreApp.showAlert('المنتج نفذ من المخزون', 'error');
            return;
        }
        
        // البحث عن المنتج في السلة
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        StoreApp.showAlert(`تم إضافة ${product.name} إلى السلة`, 'success');
    },
    
    // إزالة منتج من السلة
    removeFromCart: function(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.displayCart();
    },
    
    // تحديث الكمية
    updateQuantity: function(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }
        
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.displayCart();
        }
    },
    
    // عرض السلة
    displayCart: function() {
        const itemsContainer = document.getElementById('cart-items');
        const totalElement = document.getElementById('cart-total-price');
        
        if (this.items.length === 0) {
            itemsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>سلة التسوق فارغة</h3>
                    <p>لم تقم بإضافة أي منتجات بعد</p>
                </div>
            `;
            totalElement.textContent = '0 ج.م';
            return;
        }
        
        itemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} ج.م</div>
                    <div class="cart-item-actions mt-1">
                        <button class="quantity-btn" onclick="Cart.updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span style="padding: 0 10px; font-weight: 600;">${item.quantity}</span>
                        <button class="quantity-btn" onclick="Cart.updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn btn-danger btn-small" onclick="Cart.removeFromCart(${item.id})" style="margin-right: auto;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalElement.textContent = `${total.toLocaleString()} ج.م`;
    },
    
    // فتح السلة
    openCart: function() {
        this.displayCart();
        document.getElementById('cart-modal').classList.add('active');
    },
    
    // إغلاق السلة
    closeCart: function() {
        document.getElementById('cart-modal').classList.remove('active');
    },
    
    // فتح نموذج الشراء
    checkout: function() {
        if (this.items.length === 0) {
            StoreApp.showAlert('السلة فارغة', 'error');
            return;
        }
        
        this.closeCart();
        document.getElementById('checkout-modal').classList.add('active');
    },
    
    // إغلاق نموذج الشراء
    closeCheckout: function() {
        document.getElementById('checkout-modal').classList.remove('active');
    },
    
    // إتمام الطلب
    placeOrder: function(event) {
        event.preventDefault();
        
        const order = {
            customerName: document.getElementById('customer-name').value,
            customerPhone: document.getElementById('customer-phone').value,
            customerAddress: document.getElementById('customer-address').value,
            notes: document.getElementById('order-notes').value,
            items: this.items,
            total: this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'جديد',
            createdAt: new Date().toISOString()
        };
        
        // حفظ الطلب (هنا يتم الإرسال للخادم في التطبيق الحقيقي)
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // تفريغ السلة
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        
        // إغلاق النوافذ
        this.closeCheckout();
        
        // عرض رسالة النجاح
        StoreApp.showAlert('🎉 تم إرسال طلبك بنجاح! سنتصل بك قريباً لتأكيد الطلب', 'success');
        
        // تفريغ النموذج
        document.getElementById('checkout-form').reset();
    },
    
    // دالة مساعدة لجلب المنتج
    getProductById: function(id) {
        // في التطبيق الحقيقي، يتم جلب المنتج من قاعدة البيانات
        const products = [
            { id: 1, name: 'هاتف سامسونج جالكسي', price: 5000, stock: 10, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop' },
            { id: 2, name: 'تيشيرت رجالي قطن', price: 150, stock: 25, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop' },
            { id: 3, name: 'كتاب تطوير الويب', price: 200, stock: 15, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w-400&h=300&fit=crop' },
            { id: 4, name: 'عطر رجالي فاخر', price: 300, stock: 8, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop' }
        ];
        
        return products.find(product => product.id === id);
    }
};

// تعريض الدوال للاستخدام في HTML
window.openCart = () => Cart.openCart();
window.closeCart = () => Cart.closeCart();
window.closeCheckout = () => Cart.closeCheckout();
window.checkout = () => Cart.checkout();
window.placeOrder = (e) => Cart.placeOrder(e);