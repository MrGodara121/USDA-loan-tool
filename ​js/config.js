// config.js - API Configuration
const CONFIG = {
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_APPS_SCRIPT_ID/exec',
    PREMIUM_PRICE: 39.99,
    PREMIUM_CURRENCY: 'USD',
    DOMAIN: 'usdaloantool.com',
    CACHE_DURATION: 1800,
    FEATURES: {
        enableCache: true,
        enableAnalytics: true,
        enablePremiumOffers: true
    }
};

async function loadConfig() {
    try {
        const response = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=getConfig`);
        const data = await response.json();
        if (data.status === 'success' && data.config) {
            if (data.config.Premium_Price) CONFIG.PREMIUM_PRICE = parseFloat(data.config.Premium_Price);
            console.log('Config loaded from Google Sheets');
        }
    } catch (error) {
        console.log('Using default config');
    }
}
loadConfig();
