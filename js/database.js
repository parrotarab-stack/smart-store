// 📦 قاعدة بيانات المتجر الذكي - النسخة الكاملة
// الإصدار: 2.1 | تاريخ التحديث: 2024

const SmartStoreDB = {
    // ===== الإعدادات الأساسية =====
    DB_NAME: 'smartstore_db',
    VERSION: '2.1',
    
    // ===== 1. تهيئة النظام =====
    init: function() {
        console.log('🚀 تهيئة قاعدة البيانات...');
        
        // التحقق من وجود بيانات قديمة ونقلها
        this.migrateOldData();
        
        // إنشاء بيانات افتراضية إذا لم تكن موجودة
        if (!localStorage.getItem(this.DB_NAME)) {
            this.createDefaultData();
        }
        
        // جلب جميع البيانات
        const data = this.getAll();
        
        // إضافة المستخدم الافتراضي إذا لم يكن موجوداً
        if (!data.users || data.users.length === 0) {
            this.addUser('مدير النظام', 'admin@store.com', '123456', 'admin');
        }
        
        console.log('✅ تم تهيئة النظام بنجاح');
        return data;
    },
    
    // ===== 2. إنشاء بيانات افتراضية محسنة =====
    createDefaultData: function() {
        const defaultData = {
            // معلومات النظام
            system: {
                version: this.VERSION,
                lastBackup: new Date().toISOString(),
                lastSync: new Date().toISOString(),
                deviceId: this.generateDeviceId(),
                createdAt: new Date().toISOString()
            },
            
            // المستخدمين
            users: [
                {
                    id: 1,
                    name: 'مدير النظام',
                    email: 'admin@store.com',
                    password: '123456',
                    role: 'admin',
                    phone: '01012345678',
                    createdAt: new Date().toISOString(),
                    lastLogin: null
                }
            ],
            
            // الفئات
            categories: [
                { 
                    id: 1, 
                    name: 'إلكترونيات', 
                    icon: 'fas fa-laptop', 
                    color: '#3b82f6',
                    description: 'أجهزة إلكترونية حديثة',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 2, 
                    name: 'ملابس', 
                    icon: 'fas fa-tshirt', 
                    color: '#10b981',
                    description: 'ملابس بأحدث الموضات',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 3, 
                    name: 'أدوات منزلية', 
                    icon: 'fas fa-home', 
                    color: '#f59e0b',
                    description: 'مستلزمات المنزل',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 4, 
                    name: 'كتب', 
                    icon: 'fas fa-book', 
                    color: '#8b5cf6',
                    description: 'كتب متنوعة',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 5, 
                    name: 'ألعاب', 
                    icon: 'fas fa-gamepad', 
                    color: '#ef4444',
                    description: 'ألعاب إلكترونية وتقليدية',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 6, 
                    name: 'عطور', 
                    icon: 'fas fa-spray-can', 
                    color: '#ec4899',
                    description: 'عطور ومستحضرات تجميل',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 7, 
                    name: 'أجهزة', 
                    icon: 'fas fa-mobile-alt', 
                    color: '#06b6d4',
                    description: 'أجهزة ذكية',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 8, 
                    name: 'طعام', 
                    icon: 'fas fa-utensils', 
                    color: '#84cc16',
                    description: 'مواد غذائية',
                    createdAt: new Date().toISOString()
                }
            ],
            
            // المنتجات
            products: [
                {
                    id: 1,
                    name: 'هاتف سامسونج جالكسي S23',
                    categoryId: 1,
                    price: 15000,
                    originalPrice: 17000,
                    discountPercent: 12,
                    stock: 15,
                    image: this.getDefaultImage('إلكترونيات', 'هاتف سامسونج'),
                    images: [],
                    description: 'هاتف ذكي بشاشة 6.5 بوصة، كاميرا 48 ميجابكسل، ذاكرة 128 جيجابايت',
                    specifications: 'شاشة: 6.5 بوصة\nكاميرا: 48 ميجابكسل\nالذاكرة: 128 جيجابايت\nالبطارية: 4000 مللي أمبير',
                    featured: true,
                    rating: 4.5,
                    reviews: 24,
                    tags: ['هاتف', 'جالكسي', 'سامسونج', 'أندرويد'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'تيشيرت رجالي قطن',
                    categoryId: 2,
                    price: 150,
                    originalPrice: 200,
                    discountPercent: 25,
                    stock: 50,
                    image: this.getDefaultImage('ملابس', 'تيشيرت رجالي'),
                    images: [],
                    description: 'تيشيرت قطن 100%، متوفر بألوان متعددة، مريح للارتداء',
                    specifications: 'الخامة: قطن 100%\nالألوان: أبيض، أسود، أزرق، رمادي\nالمقاسات: S, M, L, XL',
                    featured: true,
                    rating: 4.2,
                    reviews: 18,
                    tags: ['ملابس', 'رجالي', 'قطن', 'تيشيرت'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'كتاب تعليم البرمجة',
                    categoryId: 4,
                    price: 120,
                    stock: 30,
                    image: this.getDefaultImage('كتب', 'كتاب برمجة'),
                    images: [],
                    description: 'كتاب شامل لتعليم البرمجة للمبتدئين، يحتوي على أمثلة عملية',
                    specifications: 'عدد الصفحات: 350\nاللغة: العربية\nالموضوع: برمجة',
                    featured: true,
                    rating: 4.7,
                    reviews: 32,
                    tags: ['كتاب', 'برمجة', 'تعليم', 'تقنية'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 4,
                    name: 'عطر رجالي فاخر',
                    categoryId: 6,
                    price: 350,
                    originalPrice: 450,
                    discountPercent: 22,
                    stock: 25,
                    image: this.getDefaultImage('عطور', 'عطر رجالي'),
                    images: [],
                    description: 'عطر رجالي فاخر برائحة مميزة تدوم طويلاً',
                    specifications: 'الحجم: 100 مل\nالنوع: عطر رجالي\nرائحة: خشبية',
                    featured: true,
                    rating: 4.4,
                    reviews: 15,
                    tags: ['عطر', 'رجالي', 'فاخر', 'عطور'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 5,
                    name: 'لابتوب ديل',
                    categoryId: 1,
                    price: 12000,
                    stock: 8,
                    image: this.getDefaultImage('إلكترونيات', 'لابتوب ديل'),
                    images: [],
                    description: 'لابتوب ديل بقوة أداء عالية، مناسب للأعمال والألعاب',
                    specifications: 'المعالج: Core i7\nالذاكرة: 16 جيجابايت\nالتخزين: 512 جيجابايت SSD',
                    featured: false,
                    rating: 4.6,
                    reviews: 21,
                    tags: ['لابتوب', 'ديل', 'كمبيوتر', 'إلكترونيات'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 6,
                    name: 'ساعة ذكية',
                    categoryId: 7,
                    price: 800,
                    originalPrice: 1000,
                    discountPercent: 20,
                    stock: 20,
                    image: this.getDefaultImage('أجهزة', 'ساعة ذكية'),
                    images: [],
                    description: 'ساعة ذكية بتقنيات متطورة، تتبع اللياقة البدنية',
                    specifications: 'الشاشة: 1.5 بوصة\nالبطارية: 7 أيام\nالمقاومة: ماء',
                    featured: true,
                    rating: 4.3,
                    reviews: 28,
                    tags: ['ساعة', 'ذكية', 'لياقة', 'رياضة'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 7,
                    name: 'لعبة بلايستيشن 5',
                    categoryId: 5,
                    price: 15000,
                    stock: 5,
                    image: this.getDefaultImage('ألعاب', 'بلايستيشن 5'),
                    images: [],
                    description: 'أحدث إصدار من بلايستيشن، أداء قوي وتجربة لعب مذهلة',
                    specifications: 'التخزين: 825 جيجابايت\nالدقة: 4K\nالألعاب المرفقة: 1 لعبة',
                    featured: true,
                    rating: 4.8,
                    reviews: 45,
                    tags: ['لعبة', 'بلايستيشن', 'تسلية', 'ألعاب'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 8,
                    name: 'طقم أدوات مطبخ',
                    categoryId: 3,
                    price: 250,
                    stock: 40,
                    image: this.getDefaultImage('أدوات منزلية', 'أدوات مطبخ'),
                    images: [],
                    description: 'طقم أدوات مطبخ كامل، مواد عالية الجودة',
                    specifications: 'العدد: 15 قطعة\nالمادة: ستانلس ستيل\nالتخزين: حافظة خاصة',
                    featured: false,
                    rating: 4.1,
                    reviews: 12,
                    tags: ['مطبخ', 'أدوات', 'منزل', 'أواني'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ],
            
            // الطلبات
            orders: [],
            
            // العملاء
            customers: [],
            
            // الرسائل
            messages: [],
            
            // المشتركين في النشرة البريدية
            subscribers: [],
            
            // الصور المحلية
            localImages: {},
            
            // المنتجات المفضلة
            wishlist: [],
            
            // سجل النشاط
            activityLog: [],
            
            // الإعدادات
            settings: {
                storeName: 'المتجر الذكي',
                storeEmail: 'info@store.com',
                storePhone: '01000621448',
                storeAddress: 'السنبلاوين - الدقهلية - مصر',
                storeDescription: 'متجر إلكتروني يوفر أفضل المنتجات بأفضل الأسعار',
                currency: 'ج.م',
                currencySymbol: 'ج.م',
                taxRate: 14,
                shippingCostLocal: 0,
                shippingCostNational: 30,
                freeShippingMin: 500,
                colors: {
                    primary: '#2563eb',
                    secondary: '#10b981',
                    accent: '#f59e0b',
                    background: '#f9fafb',
                    text: '#1f2937'
                },
                socialMedia: {
                    facebook: '',
                    twitter: '',
                    instagram: '',
                    whatsapp: '01000621448'
                },
                seo: {
                    title: 'المتجر الذكي - أفضل المنتجات بأفضل الأسعار',
                    description: 'متجر إلكتروني متخصص في بيع المنتجات المختلفة',
                    keywords: 'متجر, تسوق, شراء, منتجات'
                },
                paymentMethods: ['نقداً عند الاستلام'],
                deliveryTime: '24-48 ساعة',
                workingHours: '9 ص - 11 م',
                notifications: {
                    email: true,
                    sms: true,
                    push: false
                },
                maintenanceMode: false,
                version: this.VERSION
            }
        };
        
        localStorage.setItem(this.DB_NAME, JSON.stringify(defaultData));
        console.log('✅ تم إنشاء قاعدة بيانات جديدة');
        
        // تسجيل نشاط النظام
        this.logActivity('تهيئة النظام', 'تم إنشاء قاعدة بيانات جديدة');
        
        return defaultData;
    },
    
    // ===== 3. توليد صورة افتراضية ذكية =====
    getDefaultImage: function(category, productName) {
        const categoryColors = {
            'إلكترونيات': { bg: '3b82f6', text: 'ffffff' },
            'ملابس': { bg: '10b981', text: 'ffffff' },
            'أدوات منزلية': { bg: 'f59e0b', text: 'ffffff' },
            'كتب': { bg: '8b5cf6', text: 'ffffff' },
            'ألعاب': { bg: 'ef4444', text: 'ffffff' },
            'عطور': { bg: 'ec4899', text: 'ffffff' },
            'أجهزة': { bg: '06b6d4', text: 'ffffff' },
            'طعام': { bg: '84cc16', text: 'ffffff' }
        };
        
        const cat = categoryColors[category] || { bg: '3b82f6', text: 'ffffff' };
        const shortName = productName.length > 20 ? 
                         productName.substring(0, 20) + '...' : productName;
        
        return `https://via.placeholder.com/400x300/${cat.bg}/${cat.text}?text=${encodeURIComponent(shortName)}`;
    },
    
    // ===== 4. توليد معرف جهاز فريد =====
    generateDeviceId: function() {
        let deviceId = localStorage.getItem('device_id');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('device_id', deviceId);
        }
        return deviceId;
    },
    
    // ===== 5. نقل البيانات القديمة =====
    migrateOldData: function() {
        const oldData = localStorage.getItem('smartstore_data');
        if (oldData) {
            console.log('🔄 نقل البيانات القديمة...');
            try {
                const parsedOld = JSON.parse(oldData);
                const newData = this.getAll() || this.createDefaultData();
                
                // نقل المستخدمين
                if (parsedOld.users && parsedOld.users.length > 0) {
                    newData.users = [...parsedOld.users, ...newData.users];
                }
                
                // نقل المنتجات
                if (parsedOld.products && parsedOld.products.length > 0) {
                    newData.products = [...parsedOld.products, ...newData.products];
                }
                
                // نقل الطلبات
                if (parsedOld.orders && parsedOld.orders.length > 0) {
                    newData.orders = [...parsedOld.orders, ...newData.orders];
                }
                
                // نقل الفئات
                if (parsedOld.categories && parsedOld.categories.length > 0) {
                    newData.categories = [...parsedOld.categories, ...newData.categories];
                }
                
                localStorage.setItem(this.DB_NAME, JSON.stringify(newData));
                localStorage.removeItem('smartstore_data');
                
                console.log('✅ تم نقل البيانات القديمة بنجاح');
                this.logActivity('نقل البيانات', 'تم نقل البيانات من النسخة القديمة');
                
            } catch (error) {
                console.error('❌ خطأ في نقل البيانات:', error);
                this.logActivity('خطأ نقل البيانات', error.message, 'error');
            }
        }
    },
    
    // ===== 6. جلب جميع البيانات =====
    getAll: function() {
        try {
            const data = localStorage.getItem(this.DB_NAME);
            if (!data) {
                console.log('📂 قاعدة البيانات غير موجودة');
                return null;
            }
            return JSON.parse(data);
        } catch (error) {
            console.error('❌ خطأ في قراءة البيانات:', error);
            this.logActivity('خطأ قراءة البيانات', error.message, 'error');
            return null;
        }
    },
    
    // ===== 7. جلب جدول محدد =====
    get: function(table) {
        const data = this.getAll();
        if (!data || !data[table]) {
            return [];
        }
        return data[table];
    },
    
    // ===== 8. تسجيل الدخول =====
    login: function(email, password) {
        const users = this.get('users');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // تحديث وقت آخر دخول
            user.lastLogin = new Date().toISOString();
            this.update('users', user.id, { lastLogin: user.lastLogin });
            
            // تخزين جلسة المستخدم
            const session = {
                user: { 
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone
                },
                deviceId: this.generateDeviceId(),
                loginTime: new Date().toISOString(),
                token: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
            };
            
            localStorage.setItem('currentSession', JSON.stringify(session));
            
            // تسجيل نشاط الدخول
            this.logActivity('تسجيل دخول', `المستخدم ${user.name} سجل الدخول`);
            
            return { 
                success: true, 
                user: session.user,
                token: session.token 
            };
        }
        
        // تسجيل محاولة دخول فاشلة
        this.logActivity('محاولة دخول فاشلة', `بريد: ${email}`, 'warning');
        
        return { 
            success: false, 
            message: 'بيانات الدخول غير صحيحة' 
        };
    },
    
    // ===== 9. تسجيل الخروج =====
    logout: function() {
        const session = this.getCurrentSession();
        if (session && session.user) {
            this.logActivity('تسجيل خروج', `المستخدم ${session.user.name} سجل الخروج`);
        }
        
        localStorage.removeItem('currentSession');
        return true;
    },
    
    // ===== 10. جلب الجلسة الحالية =====
    getCurrentSession: function() {
        const session = localStorage.getItem('currentSession');
        if (session) {
            try {
                return JSON.parse(session);
            } catch (e) {
                return null;
            }
        }
        return null;
    },
    
    // ===== 11. جلب المستخدم الحالي =====
    getCurrentUser: function() {
        const session = this.getCurrentSession();
        return session ? session.user : null;
    },
    
    // ===== 12. إضافة عنصر جديد =====
    add: function(table, item) {
        const data = this.getAll();
        if (!data) {
            console.error('❌ لا يمكن إضافة عنصر - قاعدة البيانات غير موجودة');
            return null;
        }
        
        if (!data[table]) {
            data[table] = [];
        }
        
        // توليد معرف فريد
        item.id = Date.now() + Math.floor(Math.random() * 1000);
        item.createdAt = new Date().toISOString();
        item.updatedAt = new Date().toISOString();
        
        // إضافة معرف الجهاز للعناصر الهامة
        if (['products', 'orders', 'users'].includes(table)) {
            item.deviceId = this.generateDeviceId();
        }
        
        data[table].push(item);
        localStorage.setItem(this.DB_NAME, JSON.stringify(data));
        
        // تحديث وقت التعديل الأخير
        this.updateLastModified();
        
        // تسجيل النشاط
        this.logActivity(`إضافة ${table}`, `تم إضافة عنصر جديد (${item.id})`);
        
        return item;
    },
    
    // ===== 13. تحديث عنصر =====
    update: function(table, id, updates) {
        const data = this.getAll();
        if (!data || !data[table]) {
            console.error(`❌ الجدول ${table} غير موجود`);
            return false;
        }
        
        const index = data[table].findIndex(item => item.id == id);
        if (index === -1) {
            console.error(`❌ العنصر ${id} غير موجود في ${table}`);
            return false;
        }
        
        // حفظ النسخة القديمة للتسجيل
        const oldItem = { ...data[table][index] };
        
        // التحديث
        data[table][index] = { 
            ...data[table][index], 
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        // تحديث معرف الجهاز
        if (['products', 'orders', 'users'].includes(table)) {
            data[table][index].deviceId = this.generateDeviceId();
        }
        
        localStorage.setItem(this.DB_NAME, JSON.stringify(data));
        this.updateLastModified();
        
        // تسجيل النشاط
        this.logActivity(
            `تحديث ${table}`, 
            `تم تحديث العنصر ${id}`, 
            'info',
            { old: oldItem, new: data[table][index] }
        );
        
        return true;
    },
    
    // ===== 14. حذف عنصر =====
    delete: function(table, id) {
        const data = this.getAll();
        if (!data || !data[table]) {
            console.error(`❌ الجدول ${table} غير موجود`);
            return false;
        }
        
        const initialLength = data[table].length;
        const deletedItem = data[table].find(item => item.id == id);
        
        data[table] = data[table].filter(item => item.id != id);
        
        localStorage.setItem(this.DB_NAME, JSON.stringify(data));
        this.updateLastModified();
        
        const success = data[table].length !== initialLength;
        
        if (success && deletedItem) {
            // تسجيل النشاط
            this.logActivity(
                `حذف ${table}`, 
                `تم حذف العنصر ${id}`, 
                'warning',
                { deletedItem }
            );
        }
        
        return success;
    },
    
    // ===== 15. تحديث وقت التعديل =====
    updateLastModified: function() {
        const data = this.getAll();
        if (data && data.system) {
            data.system.lastModified = new Date().toISOString();
            localStorage.setItem(this.DB_NAME, JSON.stringify(data));
        }
    },
    
    // ===== 16. تسجيل نشاط =====
    logActivity: function(action, description, type = 'info', data = null) {
        const activity = {
            id: Date.now(),
            action: action,
            description: description,
            type: type, // info, success, warning, error
            user: this.getCurrentUser()?.name || 'النظام',
            userId: this.getCurrentUser()?.id || null,
            deviceId: this.generateDeviceId(),
            timestamp: new Date().toISOString(),
            data: data
        };
        
        const dataObj = this.getAll();
        if (!dataObj.activityLog) {
            dataObj.activityLog = [];
        }
        
        dataObj.activityLog.unshift(activity); // إضافة في البداية
        if (dataObj.activityLog.length > 1000) {
            dataObj.activityLog = dataObj.activityLog.slice(0, 1000); // الاحتفاظ بـ 1000 سجل فقط
        }
        
        localStorage.setItem(this.DB_NAME, JSON.stringify(dataObj));
    },
    
    // ===== 17. إضافة مستخدم جديد =====
    addUser: function(name, email, password, role = 'admin', phone = '') {
        const user = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            role: role,
            phone: phone,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            active: true
        };
        
        return this.add('users', user);
    },
    
    // ===== 18. إعادة تعيين كلمة المرور =====
    resetPassword: function(email, newPassword) {
        const users = this.get('users');
        const user = users.find(u => u.email === email);
        
        if (user) {
            this.update('users', user.id, { 
                password: newPassword,
                updatedAt: new Date().toISOString()
            });
            
            this.logActivity(
                'إعادة تعيين كلمة المرور',
                `تم إعادة تعيين كلمة مرور المستخدم ${user.name}`
            );
            
            return true;
        }
        
        return false;
    },
    
    // ===== 19. تغيير كلمة مرور المستخدم الحالي =====
    changePassword: function(currentPassword, newPassword) {
        const user = this.getCurrentUser();
        if (!user) {
            return { success: false, message: 'يجب تسجيل الدخول أولاً' };
        }
        
        const users = this.get('users');
        const userData = users.find(u => u.id === user.id);
        
        if (!userData) {
            return { success: false, message: 'المستخدم غير موجود' };
        }
        
        if (userData.password !== currentPassword) {
            return { success: false, message: 'كلمة المرور الحالية غير صحيحة' };
        }
        
        this.update('users', user.id, { 
            password: newPassword,
            updatedAt: new Date().toISOString()
        });
        
        this.logActivity(
            'تغيير كلمة المرور',
            `قام ${user.name} بتغيير كلمة المرور`
        );
        
        return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
    },
    
    // ===== 20. النسخ الاحتياطي =====
    backup: function() {
        const data = this.getAll();
        if (!data) {
            return { success: false, message: 'لا توجد بيانات للنسخ الاحتياطي' };
        }
        
        const backupData = {
            ...data,
            backupInfo: {
                date: new Date().toISOString(),
                version: this.VERSION,
                deviceId: this.generateDeviceId(),
                itemsCount: {
                    products: data.products?.length || 0,
                    orders: data.orders?.length || 0,
                    users: data.users?.length || 0,
                    categories: data.categories?.length || 0
                }
            }
        };
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartstore_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // تحديث وقت النسخ الاحتياطي
        if (data.system) {
            data.system.lastBackup = new Date().toISOString();
            localStorage.setItem(this.DB_NAME, JSON.stringify(data));
        }
        
        this.logActivity('نسخ احتياطي', 'تم إنشاء نسخة احتياطية');
        
        return { 
            success: true, 
            message: 'تم إنشاء النسخة الاحتياطية بنجاح',
            filename: a.download 
        };
    },
    
    // ===== 21. استعادة النسخة الاحتياطية =====
    restore: function(backupData) {
        if (!backupData || (!backupData.products && !backupData.users)) {
            throw new Error('النسخة الاحتياطية غير صالحة');
        }
        
        // حفظ نسخة احتياطية من البيانات الحالية أولاً
        this.backup();
        
        // استعادة البيانات الجديدة
        localStorage.setItem(this.DB_NAME, JSON.stringify(backupData));
        
        this.logActivity('استعادة نسخة احتياطية', 'تم استعادة البيانات من النسخة الاحتياطية');
        
        // إعادة تحميل الصفحة بعد تأخير
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        
        return { 
            success: true, 
            message: 'تم استعادة النسخة الاحتياطية بنجاح، سيتم إعادة تحميل الصفحة' 
        };
    },
    
    // ===== 22. مزامنة البيانات بين الأجهزة =====
    syncData: function() {
        const data = this.getAll();
        if (!data) {
            return null;
        }
        
        const syncPackage = {
            data: data,
            syncInfo: {
                date: new Date().toISOString(),
                deviceId: this.generateDeviceId(),
                version: this.VERSION
            }
        };
        
        return JSON.stringify(syncPackage);
    },
    
    // ===== 23. استيراد البيانات =====
    importData: function(importData) {
        try {
            const parsed = JSON.parse(importData);
            
            // إذا كان يحتوي على حقل backupInfo فهو نسخة احتياطية
            if (parsed.backupInfo) {
                return this.restore(parsed);
            }
            
            // إذا كان يحتوي على حقل data فهو حزمة مزامنة
            if (parsed.data) {
                return this.restore(parsed.data);
            }
            
            // إذا كان يحتوي على منتجات فهو بيانات منتجات
            if (parsed.products) {
                const currentData = this.getAll();
                currentData.products = [...currentData.products, ...parsed.products];
                localStorage.setItem(this.DB_NAME, JSON.stringify(currentData));
                
                this.logActivity('استيراد بيانات', `تم استيراد ${parsed.products.length} منتج`);
                
                return { 
                    success: true, 
                    message: `تم استيراد ${parsed.products.length} منتج بنجاح` 
                };
            }
            
            throw new Error('تنسيق البيانات غير معروف');
            
        } catch (error) {
            console.error('❌ خطأ في استيراد البيانات:', error);
            this.logActivity('خطأ استيراد بيانات', error.message, 'error');
            return { 
                success: false, 
                message: 'خطأ في استيراد البيانات: ' + error.message 
            };
        }
    },
    
    // ===== 24. إحصائيات النظام =====
    getStats: function() {
        const products = this.get('products');
        const orders = this.get('orders');
        const users = this.get('users');
        const messages = this.get('messages');
        const customers = this.get('customers');
        
        // حساب إجمالي المبيعات
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        // حساب الطلبات حسب الحالة
        const ordersByStatus = {};
        orders.forEach(order => {
            ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
        });
        
        // حساب المنتجات حسب المخزون
        const outOfStock = products.filter(p => p.stock <= 0).length;
        const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
        const inStock = products.filter(p => p.stock > 10).length;
        
        // حساب المبيعات اليومية
        const today = new Date().toDateString();
        const todayOrders = orders.filter(order => 
            new Date(order.createdAt).toDateString() === today
        );
        const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        // حساب المنتجات المميزة
        const featuredProducts = products.filter(p => p.featured).length;
        
        // حساب متوسط قيمة الطلب
        const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
        
        // حساب العملاء الجدد اليوم
        const todayCustomers = customers.filter(customer => 
            new Date(customer.createdAt).toDateString() === today
        ).length;
        
        return {
            // الأساسيات
            totalProducts: products.length,
            totalOrders: orders.length,
            totalCustomers: users.filter(u => u.role === 'customer').length,
            totalMessages: messages.length,
            
            // المبيعات
            totalRevenue: totalRevenue,
            todayRevenue: todayRevenue,
            avgOrderValue: avgOrderValue,
            
            // المخزون
            outOfStock: outOfStock,
            lowStock: lowStock,
            inStock: inStock,
            featuredProducts: featuredProducts,
            
            // الطلبات
            ordersByStatus: ordersByStatus,
            todayOrders: todayOrders.length,
            
            // العملاء
            todayCustomers: todayCustomers,
            
            // الأداء
            conversionRate: orders.length > 0 ? (orders.length / customers.length * 100).toFixed(2) : 0
        };
    },
    
    // ===== 25. البحث في المنتجات =====
    searchProducts: function(query) {
        const products = this.get('products');
        if (!query || query.trim() === '') {
            return products;
        }
        
        query = query.toLowerCase().trim();
        
        return products.filter(product => {
            // البحث في الاسم
            if (product.name.toLowerCase().includes(query)) {
                return true;
            }
            
            // البحث في الوصف
            if (product.description && product.description.toLowerCase().includes(query)) {
                return true;
            }
            
            // البحث في التصنيف
            const categories = this.get('categories');
            const category = categories.find(c => c.id === product.categoryId);
            if (category && category.name.toLowerCase().includes(query)) {
                return true;
            }
            
            // البحث في المواصفات
            if (product.specifications && product.specifications.toLowerCase().includes(query)) {
                return true;
            }
            
            // البحث في العلامات
            if (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query))) {
                return true;
            }
            
            return false;
        });
    },
    
    // ===== 26. جلب المنتجات حسب الفئة =====
    getProductsByCategory: function(categoryId) {
        const products = this.get('products');
        return products.filter(product => product.categoryId == categoryId);
    },
    
    // ===== 27. جلب المنتجات المميزة =====
    getFeaturedProducts: function(limit = 8) {
        const products = this.get('products');
        return products
            .filter(product => product.featured)
            .slice(0, limit);
    },
    
    // ===== 28. جلب المنتجات المخفضة =====
    getDiscountedProducts: function(limit = 8) {
        const products = this.get('products');
        return products
            .filter(product => product.discountPercent && product.discountPercent > 0)
            .slice(0, limit);
    },
    
    // ===== 29. إنشاء طلب جديد =====
    createOrder: function(orderData) {
        const order = {
            id: Date.now(),
            orderNumber: 'ORD-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6),
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            customerAddress: orderData.customerAddress,
            customerEmail: orderData.customerEmail || '',
            items: orderData.items || [],
            subtotal: orderData.subtotal || 0,
            shipping: orderData.shipping || 0,
            tax: orderData.tax || 0,
            total: orderData.total || 0,
            notes: orderData.notes || '',
            status: 'جديد',
            paymentMethod: orderData.paymentMethod || 'نقداً عند الاستلام',
            deliveryTime: orderData.deliveryTime || '24-48 ساعة',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deviceId: this.generateDeviceId()
        };
        
        // خصم الكمية من المخزون
        order.items.forEach(item => {
            this.updateProductStock(item.productId, -item.quantity);
        });
        
        const savedOrder = this.add('orders', order);
        
        // إضافة العميل إذا كان جديداً
        this.addCustomerIfNotExists(order.customerName, order.customerPhone, order.customerEmail);
        
        this.logActivity(
            'طلب جديد',
            `تم إنشاء طلب جديد برقم ${order.orderNumber} من ${order.customerName}`,
            'success',
            { orderNumber: order.orderNumber, total: order.total }
        );
        
        return savedOrder;
    },
    
    // ===== 30. تحديث مخزون المنتج =====
    updateProductStock: function(productId, quantityChange) {
        const product = this.get('products').find(p => p.id == productId);
        if (product) {
            const newStock = Math.max(0, product.stock + quantityChange);
            this.update('products', productId, { 
                stock: newStock,
                updatedAt: new Date().toISOString()
            });
            
            // تسجيل حركة المخزون
            if (quantityChange !== 0) {
                this.logActivity(
                    'تحديث المخزون',
                    `تم ${quantityChange > 0 ? 'إضافة' : 'خصم'} ${Math.abs(quantityChange)} من مخزون المنتج ${product.name}`,
                    quantityChange > 0 ? 'success' : 'warning'
                );
            }
            
            return newStock;
        }
        return null;
    },
    
    // ===== 31. إضافة عميل إذا لم يكن موجوداً =====
    addCustomerIfNotExists: function(name, phone, email = '') {
        const customers = this.get('customers');
        const existingCustomer = customers.find(c => c.phone === phone);
        
        if (!existingCustomer) {
            const customer = {
                id: Date.now(),
                name: name,
                phone: phone,
                email: email,
                ordersCount: 1,
                totalSpent: 0,
                firstOrderDate: new Date().toISOString(),
                lastOrderDate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                notes: ''
            };
            
            this.add('customers', customer);
            
            this.logActivity(
                'عميل جديد',
                `تم إضافة عميل جديد: ${name}`,
                'success'
            );
            
            return customer;
        } else {
            // تحديث بيانات العميل الحالي
            this.update('customers', existingCustomer.id, {
                ordersCount: (existingCustomer.ordersCount || 0) + 1,
                lastOrderDate: new Date().toISOString(),
                name: existingCustomer.name || name,
                email: existingCustomer.email || email
            });
            
            return existingCustomer;
        }
    },
    
    // ===== 32. جلب الإعدادات =====
    getSettings: function() {
        const data = this.getAll();
        return data?.settings || {};
    },
    
    // ===== 33. تحديث الإعدادات =====
    updateSettings: function(newSettings) {
        const data = this.getAll();
        if (!data) return false;
        
        data.settings = {
            ...data.settings,
            ...newSettings,
            updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem(this.DB_NAME, JSON.stringify(data));
        
        this.logActivity(
            'تحديث الإعدادات',
            'تم تحديث إعدادات المتجر',
            'info'
        );
        
        return true;
    },
    
    // ===== 34. جلب أحدث النشاطات =====
    getRecentActivity: function(limit = 50) {
        const activities = this.get('activityLog');
        return activities.slice(0, limit);
    },
    
    // ===== 35. تنظيف البيانات القديمة =====
    cleanupOldData: function(days = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const data = this.getAll();
        let cleanedCount = 0;
        
        // تنظيف سجل النشاط
        if (data.activityLog) {
            const initialCount = data.activityLog.length;
            data.activityLog = data.activityLog.filter(activity => 
                new Date(activity.timestamp) > cutoffDate
            );
            cleanedCount += (initialCount - data.activityLog.length);
        }
        
        // تنظيف الرسائل القديمة
        if (data.messages) {
            const initialCount = data.messages.length;
            data.messages = data.messages.filter(message => 
                new Date(message.createdAt) > cutoffDate
            );
            cleanedCount += (initialCount - data.messages.length);
        }
        
        localStorage.setItem(this.DB_NAME, JSON.stringify(data));
        
        if (cleanedCount > 0) {
            this.logActivity(
                'تنظيف البيانات',
                `تم تنظيف ${cleanedCount} سجل قديم`,
                'info'
            );
        }
        
        return cleanedCount;
    },
    
    // ===== 36. تصدير البيانات بالتنسيقات المختلفة =====
    exportData: function(format = 'json', tables = ['products', 'orders', 'users', 'categories']) {
        const data = this.getAll();
        if (!data) return null;
        
        const exportData = {};
        
        tables.forEach(table => {
            if (data[table]) {
                exportData[table] = data[table];
            }
        });
        
        exportData.exportInfo = {
            date: new Date().toISOString(),
            version: this.VERSION,
            deviceId: this.generateDeviceId(),
            tables: tables
        };
        
        switch(format) {
            case 'json':
                return JSON.stringify(exportData, null, 2);
                
            case 'csv':
                // تحويل إلى CSV (مبسط)
                let csv = '';
                tables.forEach(table => {
                    if (exportData[table] && exportData[table].length > 0) {
                        csv += `\n\n=== ${table} ===\n`;
                        const headers = Object.keys(exportData[table][0]);
                        csv += headers.join(',') + '\n';
                        
                        exportData[table].forEach(item => {
                            const row = headers.map(header => 
                                JSON.stringify(item[header] || '')
                            ).join(',');
                            csv += row + '\n';
                        });
                    }
                });
                return csv;
                
            default:
                return JSON.stringify(exportData, null, 2);
        }
    },
    
    // ===== 37. التحقق من صحة النظام =====
    validateSystem: function() {
        const issues = [];
        const data = this.getAll();
        
        if (!data) {
            issues.push('❌ قاعدة البيانات غير موجودة');
            return issues;
        }
        
        // التحقق من المستخدمين
        if (!data.users || data.users.length === 0) {
            issues.push('⚠️ لا يوجد مستخدمين في النظام');
        }
        
        // التحقق من الفئات
        if (!data.categories || data.categories.length === 0) {
            issues.push('⚠️ لا توجد فئات منتجات');
        }
        
        // التحقق من المنتجات بدون فئات
        if (data.products) {
            const productsWithoutCategory = data.products.filter(p => !p.categoryId);
            if (productsWithoutCategory.length > 0) {
                issues.push(`⚠️ ${productsWithoutCategory.length} منتج بدون فئة`);
            }
            
            // التحقق من المنتجات بدون صور
            const productsWithoutImage = data.products.filter(p => !p.image || p.image.trim() === '');
            if (productsWithoutImage.length > 0) {
                issues.push(`⚠️ ${productsWithoutImage.length} منتج بدون صورة`);
            }
        }
        
        // التحقق من الإعدادات
        if (!data.settings) {
            issues.push('⚠️ الإعدادات غير موجودة');
        }
        
        // التحقق من حجم التخزين
        const storageSize = JSON.stringify(data).length;
        if (storageSize > 5 * 1024 * 1024) { // 5MB
            issues.push(`⚠️ حجم البيانات كبير (${(storageSize / 1024 / 1024).toFixed(2)} MB)`);
        }
        
        // التحقق من تاريخ آخر نسخة احتياطية
        if (data.system && data.system.lastBackup) {
            const lastBackup = new Date(data.system.lastBackup);
            const daysSinceBackup = Math.floor((new Date() - lastBackup) / (1000 * 60 * 60 * 24));
            
            if (daysSinceBackup > 7) {
                issues.push(`⚠️ لم يتم عمل نسخة احتياطية منذ ${daysSinceBackup} أيام`);
            }
        } else {
            issues.push('⚠️ لم يتم عمل أي نسخة احتياطية مسبقاً');
        }
        
        return issues;
    },
    
    // ===== 38. إصلاح مشاكل النظام =====
    repairSystem: function() {
        const repairs = [];
        const data = this.getAll();
        
        if (!data) {
            // إعادة إنشاء النظام
            this.createDefaultData();
            repairs.push('✅ تم إعادة إنشاء النظام');
            return repairs;
        }
        
        // إصلاح المنتجات بدون فئات
        if (data.products) {
            let fixedProducts = 0;
            data.products.forEach(product => {
                if (!product.categoryId && data.categories && data.categories.length > 0) {
                    product.categoryId = data.categories[0].id;
                    fixedProducts++;
                }
                
                // إصلاح الصور المفقودة
                if (!product.image || product.image.trim() === '') {
                    const category = data.categories?.find(c => c.id === product.categoryId);
                    product.image = this.getDefaultImage(
                        category?.name || 'عام',
                        product.name
                    );
                    fixedProducts++;
                }
            });
            
            if (fixedProducts > 0) {
                localStorage.setItem(this.DB_NAME, JSON.stringify(data));
                repairs.push(`✅ تم إصلاح ${fixedProducts} منتج`);
            }
        }
        
        // إضافة مستخدم افتراضي إذا لم يكن موجوداً
        if (!data.users || data.users.length === 0) {
            this.addUser('مدير النظام', 'admin@store.com', '123456', 'admin');
            repairs.push('✅ تم إضافة مستخدم افتراضي');
        }
        
        // إضافة إعدادات افتراضية
        if (!data.settings) {
            data.settings = this.createDefaultData().settings;
            localStorage.setItem(this.DB_NAME, JSON.stringify(data));
            repairs.push('✅ تم إضافة الإعدادات الافتراضية');
        }
        
        this.logActivity(
            'إصلاح النظام',
            `تم إجراء ${repairs.length} إصلاح`,
            'warning'
        );
        
        return repairs;
    }
};

// تشغيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة قاعدة البيانات
    SmartStoreDB.init();
    
    // تنظيف البيانات القديمة كل 30 يوم
    const lastCleanup = localStorage.getItem('lastCleanup');
    const today = new Date().toDateString();
    
    if (!lastCleanup || lastCleanup !== today) {
        SmartStoreDB.cleanupOldData(30);
        localStorage.setItem('lastCleanup', today);
    }
    
    console.log('🎯 النظام جاهز للعمل');
});

// جعل الكائن متاحاً عالمياً
window.SmartStoreDB = SmartStoreDB;