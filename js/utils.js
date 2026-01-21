// أدوات مساعدة عامة
const StoreUtils = {
    // 1. تنسيق الأرقام
    formatPrice: function(price) {
        return price.toLocaleString('ar-EG') + ' ج.م';
    },
    
    // 2. تقصير النص
    truncateText: function(text, length = 100) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },
    
    // 3. تحويل التاريخ
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // 4. التحقق من البريد الإلكتروني
    isValidEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // 5. التحقق من رقم الهاتف المصري
    isValidEgyptPhone: function(phone) {
        const re = /^01[0-2,5]{1}[0-9]{8}$/;
        return re.test(phone);
    },
    
    // 6. توليد رقم طلب
    generateOrderNumber: function() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
        return `ORD-${year}${month}${day}-${random}`;
    },
    
    // 7. حساب إجمالي السلة
    calculateCartTotal: function(cart) {
        return cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },
    
    // 8. تحميل الإعدادات
    loadSettings: function() {
        return JSON.parse(localStorage.getItem('store_settings')) || {
            storeName: 'المتجر الذكي',
            storeEmail: 'info@store.com',
            storePhone: '01012345678',
            storeAddress: 'القاهرة - مصر',
            currency: 'ج.م',
            tax: 14,
            shippingCost: 30
        };
    },
    
    // 9. حفظ الإعدادات
    saveSettings: function(settings) {
        localStorage.setItem('store_settings', JSON.stringify(settings));
        return true;
    },
    
    // 10. التحقق من وجود الإنترنت
    checkInternetConnection: function() {
        return navigator.onLine;
    },
    
    // 11. إظهار رسالة تأكيد
    showConfirmation: function(message) {
        return confirm(message);
    },
    
    // 12. إظهار نافذة تنبيه جميلة
    showAlert: function(message, type = 'info', duration = 3000) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert ${type}`;
        alertDiv.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                  type === 'error' ? 'exclamation-circle' : 
                                  type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        }, duration);
    },
    
    // 13. تحميل الصورة كـ Base64
    imageToBase64: function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    },
    
    // 14. ضغط الصورة
    compressImage: function(file, maxWidth = 800, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', quality);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    },
    
    // 15. حفظ في LocalStorage مع وقت انتهاء
    setWithExpiry: function(key, value, ttl) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },
    
    // 16. قراءة من LocalStorage مع وقت انتهاء
    getWithExpiry: function(key) {
        const itemStr = localStorage.getItem(key);
        
        if (!itemStr) {
            return null;
        }
        
        const item = JSON.parse(itemStr);
        const now = new Date();
        
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        
        return item.value;
    }
};

// إضافة تنسيق CSS للتنبيهات
const alertStyle = document.createElement('style');
alertStyle.textContent = `
    .custom-alert {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        z-index: 9999;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        border-left: 4px solid #3498db;
        min-width: 300px;
        max-width: 500px;
    }
    
    .custom-alert.show {
        transform: translateX(0);
    }
    
    .custom-alert.success {
        border-left-color: #27ae60;
    }
    
    .custom-alert.error {
        border-left-color: #e74c3c;
    }
    
    .custom-alert.warning {
        border-left-color: #f39c12;
    }
    
    .custom-alert.info {
        border-left-color: #3498db;
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .alert-content i {
        font-size: 20px;
    }
    
    .alert-content i.fa-check-circle { color: #27ae60; }
    .alert-content i.fa-exclamation-circle { color: #e74c3c; }
    .alert-content i.fa-exclamation-triangle { color: #f39c12; }
    .alert-content i.fa-info-circle { color: #3498db; }
`;
document.head.appendChild(alertStyle);