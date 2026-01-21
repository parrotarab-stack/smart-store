// إدارة الصور المحلية
const ImageManager = {
    // رفع صورة
    uploadImage: function(file, productId = null) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                reject(new Error('الملف ليس صورة'));
                return;
            }
            
            // تحديد الحد الأقصى للحجم (5MB)
            if (file.size > 5 * 1024 * 1024) {
                reject(new Error('حجم الصورة كبير جداً (الحد الأقصى 5MB)'));
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const base64Image = e.target.result;
                const imageId = 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                
                // حفظ الصورة في قاعدة البيانات
                const data = SmartStoreDB.getAll();
                if (!data.localImages) data.localImages = {};
                
                data.localImages[imageId] = {
                    id: imageId,
                    data: base64Image,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    productId: productId,
                    uploadedAt: new Date().toISOString(),
                    deviceId: SmartStoreDB.generateDeviceId()
                };
                
                localStorage.setItem(SmartStoreDB.DB_NAME, JSON.stringify(data));
                
                const imageUrl = `local://${imageId}`;
                resolve(imageUrl);
            };
            
            reader.onerror = () => reject(new Error('خطأ في قراءة الملف'));
            reader.readAsDataURL(file);
        });
    },
    
    // جلب رابط الصورة
    getImageUrl: function(imageSource) {
        if (!imageSource) {
            return this.getDefaultImage();
        }
        
        if (imageSource.startsWith('local://')) {
            const imageId = imageSource.replace('local://', '');
            return this.getLocalImage(imageId);
        }
        
        if (imageSource.startsWith('http') || imageSource.startsWith('data:image')) {
            return imageSource;
        }
        
        return this.getDefaultImage();
    },
    
    // جلب صورة محلية
    getLocalImage: function(imageId) {
        const data = SmartStoreDB.getAll();
        if (data?.localImages?.[imageId]) {
            return data.localImages[imageId].data;
        }
        return this.getDefaultImage();
    },
    
    // صورة افتراضية
    getDefaultImage: function(category = 'عام', text = 'No Image') {
        return SmartStoreDB.getDefaultImage(category, text);
    },
    
    // اختيار صورة
    selectImage: function(callback) {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.uploadImage(file).then((imageUrl) => {
                        if (callback) callback(imageUrl);
                        resolve(imageUrl);
                    }).catch(error => {
                        console.error('خطأ في رفع الصورة:', error);
                        alert('خطأ في رفع الصورة: ' + error.message);
                    });
                }
                document.body.removeChild(input);
            };
            
            document.body.appendChild(input);
            input.click();
        });
    },
    
    // معاينة الصورة
    previewImage: function(file, previewElementId) {
        const reader = new FileReader();
        const preview = document.getElementById(previewElementId);
        
        reader.onload = (e) => {
            if (preview) {
                preview.innerHTML = `
                    <img src="${e.target.result}" 
                         style="max-width: 100%; max-height: 200px; border-radius: 10px;">
                    <div style="margin-top: 10px; font-size: 12px; color: #666;">
                        ${file.name} (${Math.round(file.size / 1024)} KB)
                    </div>
                `;
            }
        };
        
        reader.readAsDataURL(file);
    },
    
    // حذف الصور غير المستخدمة
    cleanupUnusedImages: function() {
        const data = SmartStoreDB.getAll();
        if (!data?.localImages) return 0;
        
        const products = data.products || [];
        const usedImages = new Set();
        
        // جمع الصور المستخدمة في المنتجات
        products.forEach(product => {
            if (product.image?.startsWith('local://')) {
                const imageId = product.image.replace('local://', '');
                usedImages.add(imageId);
            }
            
            if (product.images) {
                product.images.forEach(img => {
                    if (img.startsWith('local://')) {
                        const imageId = img.replace('local://', '');
                        usedImages.add(imageId);
                    }
                });
            }
        });
        
        // حذف الصور غير المستخدمة
        let deletedCount = 0;
        Object.keys(data.localImages).forEach(imageId => {
            if (!usedImages.has(imageId)) {
                delete data.localImages[imageId];
                deletedCount++;
            }
        });
        
        if (deletedCount > 0) {
            localStorage.setItem(SmartStoreDB.DB_NAME, JSON.stringify(data));
        }
        
        return deletedCount;
    }
};

window.ImageManager = ImageManager;