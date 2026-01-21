<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة المنتجات - لوحة التحكم</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .image-upload {
            border: 2px dashed #ddd;
            border-radius: 10px;
            padding: 30px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 20px;
        }
        
        .image-upload:hover {
            border-color: #3498db;
            background: #f8f9fa;
        }
        
        .image-upload i {
            font-size: 48px;
            color: #ddd;
            margin-bottom: 15px;
        }
        
        .image-preview {
            margin-top: 20px;
            text-align: center;
        }
        
        .image-preview img {
            max-width: 100%;
            max-height: 200px;
            border-radius: 10px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        
        .featured-toggle {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }
        
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }
        
        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .slider {
            background-color: #27ae60;
        }
        
        input:checked + .slider:before {
            transform: translateX(26px);
        }
    </style>
</head>
<body>
    <!-- باقي الصفحة كما هي مع إضافة قسم رفع الصور -->
    
    <script>
    // إضافة هذا الكود إلى دالة openProductModal
    function openProductModal() {
        editingProductId = null;
        document.getElementById('modal-title').textContent = 'إضافة منتج جديد';
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        
        // إضافة قسم رفع الصور
        const imageSection = `
            <div class="form-group">
                <label>صورة المنتج</label>
                <div class="image-upload" onclick="document.getElementById('image-input').click()">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>انقر لرفع صورة من جهازك</p>
                    <p style="font-size: 12px; color: #666; margin-top: 5px;">أو أدخل رابط الصورة أدناه</p>
                    <input type="file" id="image-input" accept="image/*" style="display: none;" onchange="uploadProductImage(this.files[0])">
                </div>
                <div id="image-preview" class="image-preview"></div>
                <input type="url" id="product-image" class="form-control" placeholder="أو أدخل رابط الصورة هنا..." style="margin-top: 10px;">
            </div>
            
            <div class="form-group">
                <div class="featured-toggle">
                    <label>عرض في الصفحة الرئيسية</label>
                    <label class="switch">
                        <input type="checkbox" id="product-featured">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        `;
        
        // إضافة قسم المواصفات
        const specsSection = `
            <div class="form-group">
                <label for="product-specifications">المواصفات (اختياري)</label>
                <textarea id="product-specifications" class="form-control" rows="3" placeholder="مواصفات المنتج..."></textarea>
            </div>
        `;
        
        // إضافة الأقسام للنموذج
        const form = document.getElementById('product-form');
        const priceRow = form.querySelector('.form-row:nth-child(3)');
        
        // إضافة الأقسام بعد سعر المنتج
        priceRow.insertAdjacentHTML('afterend', imageSection + specsSection);
        
        document.getElementById('product-modal').style.display = 'flex';
    }
    
    // دالة رفع صورة المنتج
    function uploadProductImage(file) {
        if (!file) return;
        
        ImageManager.uploadImage(file, function(imageUrl) {
            // عرض معاينة الصورة
            const preview = document.getElementById('image-preview');
            const imageData = ImageManager.getLocalImage(imageUrl.replace('local://', ''));
            
            preview.innerHTML = `
                <img src="${imageData}" alt="معاينة الصورة">
                <div style="margin-top: 10px; color: #27ae60;">
                    <i class="fas fa-check-circle"></i> تم رفع الصورة بنجاح
                </div>
            `;
            
            // تعيين رابط الصورة
            document.getElementById('product-image').value = imageUrl;
        }).catch(error => {
            alert('حدث خطأ أثناء رفع الصورة: ' + error.message);
        });
    }
    
    // تحديث دالة saveProduct
    function saveProduct(event) {
        event.preventDefault();
        
        const productData = {
            name: document.getElementById('product-name').value.trim(),
            categoryId: parseInt(document.getElementById('product-category').value),
            price: parseFloat(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            image: document.getElementById('product-image').value.trim(),
            featured: document.getElementById('product-featured')?.checked || false,
            description: document.getElementById('product-description').value.trim(),
            specifications: document.getElementById('product-specifications')?.value.trim() || ''
        };
        
        // إذا كان الحقل فارغاً، استخدم صورة افتراضية
        if (!productData.image) {
            const category = document.getElementById('product-category').options[
                document.getElementById('product-category').selectedIndex
            ].text;
            productData.image = SmartStoreDB.getDefaultImage(category, productData.name);
        }
        
        // بقية الكود كما هو...
    }
    
    // تحديث دالة editProduct
    function editProduct(productId) {
        const products = SmartStoreDB.get('products');
        const product = products.find(p => p.id == productId);
        
        if (!product) return;
        
        editingProductId = productId;
        
        document.getElementById('modal-title').textContent = 'تعديل المنتج';
        document.getElementById('product-id').value = productId;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.categoryId;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-image').value = product.image || '';
        document.getElementById('product-description').value = product.description || '';
        
        // تحميل المواصفات إذا كانت موجودة
        if (product.specifications) {
            document.getElementById('product-specifications').value = product.specifications;
        }
        
        // تحميل حالة العرض في الصفحة الرئيسية
        if (document.getElementById('product-featured')) {
            document.getElementById('product-featured').checked = product.featured || false;
        }
        
        // عرض معاينة الصورة إذا كانت موجودة
        if (product.image) {
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `
                <img src="${ImageManager.getImageUrl(product.image)}" alt="معاينة الصورة">
            `;
        }
        
        document.getElementById('product-modal').style.display = 'flex';
    }
    </script>
</body>
</html>