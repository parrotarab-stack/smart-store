// إدارة المزامنة بين الأجهزة
const SyncManager = {
    // فحص حالة المزامنة
    checkSyncStatus: function() {
        const data = SmartStoreDB.getAll();
        const stats = SmartStoreDB.getStats();
        
        return {
            deviceId: data?.system?.deviceId || 'غير معروف',
            lastSync: data?.system?.lastSync || 'لم تتم',
            lastBackup: data?.system?.lastBackup || 'لم تتم',
            dataSize: JSON.stringify(data).length,
            itemsCount: {
                products: stats.totalProducts,
                orders: stats.totalOrders,
                users: stats.totalCustomers
            },
            version: SmartStoreDB.VERSION
        };
    },
    
    // تصدير البيانات للمزامنة
    exportForSync: function() {
        return SmartStoreDB.syncData();
    },
    
    // استيراد البيانات من جهاز آخر
    importFromSync: function(syncData) {
        return SmartStoreDB.importData(syncData);
    },
    
    // توليد QR Code للمزامنة
    generateSyncQR: function(elementId) {
        const syncData = this.exportForSync();
        const syncUrl = `data:text/json;charset=utf-8,${encodeURIComponent(syncData)}`;
        
        if (typeof QRCode !== 'undefined') {
            const container = document.getElementById(elementId);
            if (container) {
                container.innerHTML = '';
                new QRCode(container, {
                    text: syncUrl,
                    width: 200,
                    height: 200,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
            return syncData;
        }
        return null;
    }
};

window.SyncManager = SyncManager;