// ============================================
// إضافة: نظام التحكم في LocalStorage
// أضف هذا الكود في نهاية ملف assets/js/main.js
// ============================================

// دالة لفحص وإعادة التحميل من السيرفر
async function checkAndReloadFromServer() {
    const forceReload = localStorage.getItem('forceReload') === 'true';
    const lastUpdate = localStorage.getItem('lastUpdate');
    const oneDay = 24 * 60 * 60 * 1000; // يوم واحد بالملي ثانية
    
    if (forceReload || !lastUpdate || (Date.now() - parseInt(lastUpdate)) > oneDay) {
        console.log('🔄 جاري إعادة التحميل من السيرفر...');
        
        try {
            // جلب البيانات من db.json
            const response = await fetch('assets/js/db.json');
            if (response.ok) {
                const data = await response.json();
                
                // تحديث LocalStorage
                if (data.categories) {
                    localStorage.setItem('categories', JSON.stringify(data.categories));
                }
                if (data.products) {
                    localStorage.setItem('products', JSON.stringify(data.products));
                }
                
                console.log('✅ تم تحديث البيانات من السيرفر');
            }
        } catch (error) {
            console.error('❌ خطأ في تحديث البيانات:', error);
        }
        
        // تحديث وقت آخر تحميل
        localStorage.setItem('lastUpdate', Date.now());
        localStorage.removeItem('forceReload');
        
        // إعادة تحميل الصفحة لرؤية التغييرات
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحقق وإعادة تحميل إذا لزم الأمر
    setTimeout(checkAndReloadFromServer, 1000);
    
    // إضافة زر التحكم في لوحة المطور (إذا لم يكن موجوداً)
    if (!document.querySelector('.admin-tools-btn')) {
        setTimeout(() => {
            // سينشئ الزر تلقائياً من Alpine.js في index.html
            console.log('⚙️ أدوات المطور جاهزة');
        }, 2000);
    }
});

// إضافة دالة مساعدة للتحميل القسري من السيرفر
window.forceServerUpdate = function() {
    localStorage.setItem('forceReload', 'true');
    localStorage.removeItem('lastUpdate');
    alert('سيتم تحميل البيانات من السيرفر...');
    window.location.reload();
};

// دالة لمسح بيانات محددة
window.clearLocalStorageData = function(type) {
    if (type === 'all') {
        if (confirm('هل تريد مسح جميع البيانات المحلية؟')) {
            localStorage.clear();
            alert('تم مسح جميع البيانات');
            window.location.reload();
        }
    } else if (type === 'products') {
        if (confirm('هل تريد مسح بيانات المنتجات؟')) {
            localStorage.removeItem('products');
            localStorage.removeItem('categories');
            alert('تم مسح بيانات المنتجات');
            window.location.reload();
        }
    } else if (type === 'settings') {
        if (confirm('هل تريد مسح الإعدادات؟')) {
            localStorage.removeItem('settings');
            alert('تم مسح الإعدادات');
            window.location.reload();
        }
    }
};

// تسجيل المعلومات للتصحيح
console.log('ℹ️ LocalStorage الحالي:', {
    hasCategories: !!localStorage.getItem('categories'),
    hasProducts: !!localStorage.getItem('products'),
    hasSettings: !!localStorage.getItem('settings'),
    forceReload: localStorage.getItem('forceReload'),
    lastUpdate: localStorage.getItem('lastUpdate')
});