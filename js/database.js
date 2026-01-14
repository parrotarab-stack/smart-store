// قاعدة البيانات البسيطة
const SmartStoreDB = {
    // 1. تهيئة البيانات الافتراضية
    init: function() {
        if (!localStorage.getItem('smartstore_data')) {
            const defaultData = {
                // المستخدمين (مدير فقط)
                users: [{
                    id: 1,
                    name: 'المدير',
                    email: 'admin@store.com',
                    password: '123456',
                    role: 'admin',
                    phone: '01012345678'
                }],
                
                // الفئات
                categories: [
                    { id: 1, name: 'إلكترونيات' },
                    { id: 2, name: 'ملابس' },
                    { id: 3, name: 'أدوات منزلية' }
                ],
                
                // المنتجات
                products: [
                    {
                        id: 1,
                        name: 'هاتف سامسونج',
                        categoryId: 1,
                        price: 5000,
                        stock: 10,
                        image: 'https://via.placeholder.com/300x200/3498db/ffffff?text=Samsung',
                        description: 'هاتف ذكي بشاشة 6.5 بوصة'
                    },
                    {
                        id: 2,
                        name: 'تيشرت رجالي',
                        categoryId: 2,
                        price: 150,
                        stock: 50,
                        image: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=T-Shirt',
                        description: 'تيشرت قطن 100%'
                    }
                ],
                
                // الطلبات
                orders: [
                    {
                        id: 1,
                        orderNumber: 'ORD-2024-001',
                        customerName: 'أحمد محمد',
                        customerPhone: '01011112222',
                        customerAddress: 'القاهرة - مصر',
                        items: [
                            { productId: 1, name: 'هاتف سامسونج', price: 5000, quantity: 1 }
                        ],
                        total: 5000,
                        status: 'جديد',
                        notes: '',
                        createdAt: new Date().toISOString()
                    }
                ],
                
                // رسائل العملاء
                messages: [
                    {
                        id: 1,
                        name: 'محمد أحمد',
                        email: 'mohamed@example.com',
                        phone: '01022223333',
                        message: 'هل يوجد شحن خارج القاهرة؟',
                        createdAt: new Date().toISOString(),
                        read: false
                    }
                ]
            };
            
            localStorage.setItem('smartstore_data', JSON.stringify(defaultData));
        }
        
        return this.getAll();
    },
    
    // 2. جلب جميع البيانات
    getAll: function() {
        const data = localStorage.getItem('smartstore_data');
        return data ? JSON.parse(data) : {};
    },
    
    // 3. جلب جدول محدد
    get: function(table) {
        const data = this.getAll();
        return data[table] || [];
    },
    
    // 4. تسجيل الدخول
    login: function(email, password) {
        const users = this.get('users');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, user };
        }
        
        return { success: false, message: 'بيانات الدخول غير صحيحة' };
    },
    
    // 5. تسجيل الخروج
    logout: function() {
        localStorage.removeItem('currentUser');
        return true;
    },
    
    // 6. جلب المستخدم الحالي
    getCurrentUser: function() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },
    
    // 7. إضافة عنصر جديد
    add: function(table, item) {
        const data = this.getAll();
        const items = data[table] || [];
        
        item.id = Date.now();
        items.push(item);
        data[table] = items;
        
        localStorage.setItem('smartstore_data', JSON.stringify(data));
        return item;
    },
    
    // 8. تحديث عنصر
    update: function(table, id, updates) {
        const data = this.getAll();
        const items = data[table] || [];
        const index = items.findIndex(item => item.id == id);
        
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            data[table] = items;
            localStorage.setItem('smartstore_data', JSON.stringify(data));
            return true;
        }
        
        return false;
    },
    
    // 9. حذف عنصر
    delete: function(table, id) {
        const data = this.getAll();
        const items = data[table] || [];
        const newItems = items.filter(item => item.id != id);
        
        data[table] = newItems;
        localStorage.setItem('smartstore_data', JSON.stringify(data));
        return true;
    },
    
    // 10. جلب طلبات اليوم
    getTodayOrders: function() {
        const orders = this.get('orders');
        const today = new Date().toDateString();
        
        return orders.filter(order => {
            const orderDate = new Date(order.createdAt).toDateString();
            return orderDate === today;
        });
    }
};

// تشغيل عند تحميل الصفحة
SmartStoreDB.init();