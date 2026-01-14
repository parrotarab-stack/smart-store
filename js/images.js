// js/images.js
const ProductImages = {
    // صور افتراضية للمنتجات
    getDefaultImage: function(category, productName) {
        const imageMap = {
            'إلكترونيات': [
                'https://via.placeholder.com/400x300/3498db/ffffff?text=Electronics',
                'https://via.placeholder.com/400x300/2ecc71/ffffff?text=Gadget',
                'https://via.placeholder.com/400x300/9b59b6/ffffff?text=Device'
            ],
            'ملابس': [
                'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Fashion',
                'https://via.placeholder.com/400x300/3498db/ffffff?text=Clothes',
                'https://via.placeholder.com/400x300/2ecc71/ffffff?text=Apparel'
            ],
            'أدوات منزلية': [
                'https://via.placeholder.com/400x300/f39c12/ffffff?text=Home',
                'https://via.placeholder.com/400x300/16a085/ffffff?text=Tools',
                'https://via.placeholder.com/400x300/8e44ad/ffffff?text=Kitchen'
            ]
        };
        
        const images = imageMap[category] || imageMap['إلكترونيات'];
        return images[Math.floor(Math.random() * images.length)];
    },
    
    // التحقق من صحة رابط الصورة
    validateImageUrl: function(url) {
        if (!url) return false;
        
        // قائمة بالمجالات المسموحة
        const allowedDomains = [
            'placeholder.com',
            'via.placeholder.com',
            'picsum.photos',
            'source.unsplash.com',
            'images.unsplash.com',
            'cdn.pixabay.com'
        ];
        
        try {
            const urlObj = new URL(url);
            return allowedDomains.some(domain => urlObj.hostname.includes(domain));
        } catch {
            return false;
        }
    },
    
    // إصلاح رابط الصورة
    fixImageUrl: function(url) {
        if (!url) {
            return this.getDefaultImage('إلكترونيات', 'Product');
        }
        
        // إذا كان الرابط صحيحاً، ارجعه كما هو
        if (this.validateImageUrl(url)) {
            return url;
        }
        
        // إذا كان يحتوي على http، غيرّه إلى https
        if (url.startsWith('http://')) {
            return url.replace('http://', 'https://');
        }
        
        // إذا لم يكن به بروتوكول، أضف https://
        if (!url.startsWith('https://')) {
            return 'https://' + url;
        }
        
        return url;
    }
};

// استخدم هذه الدالة في جميع أنحاء الموقع
function getSafeImageUrl(url, category, productName) {
    return ProductImages.fixImageUrl(url) || 
           ProductImages.getDefaultImage(category, productName);
}
