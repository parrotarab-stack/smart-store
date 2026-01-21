// Admin Tools Functions

// Force reload from server
function forceReload() {
    localStorage.setItem('forceReload', 'true');
    showToolMessage('سيتم تحميل البيانات من السيرفر...');
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Clear products data
function clearProducts() {
    if (confirm('هل تريد مسح جميع المنتجات والفئات؟')) {
        localStorage.removeItem('products');
        localStorage.removeItem('categories');
        showToolMessage('تم مسح المنتجات والفئات');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Clear settings
function clearSettings() {
    if (confirm('هل تريد مسح الإعدادات؟')) {
        localStorage.removeItem('settings');
        showToolMessage('تم مسح الإعدادات');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Clear all data
function clearAllData() {
    if (confirm('⚠️ هل أنت متأكد من مسح جميع البيانات المحلية؟')) {
        localStorage.clear();
        showToolMessage('تم مسح جميع البيانات');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Show tool message
function showToolMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed top-20 right-1/2 transform translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        animation: toolMessageFade 0.3s ease, toolMessageFade 0.3s ease 1.5s reverse forwards;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 2000);
}

// Add tool message styles
const toolMessageStyles = document.createElement('style');
toolMessageStyles.textContent = `
    @keyframes toolMessageFade {
        from { opacity: 0; transform: translate(-50%, -20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
`;
document.head.appendChild(toolMessageStyles);

// Export functions globally
window.forceReload = forceReload;
window.clearProducts = clearProducts;
window.clearSettings = clearSettings;
window.clearAllData = clearAllData;
