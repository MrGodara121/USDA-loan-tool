// api-client.js - Google Sheets API Client
const API = {
    async callAPI(action, params = {}, method = 'GET') {
        const cacheKey = `${action}_${JSON.stringify(params)}`;
        
        if (CONFIG.FEATURES.enableCache) {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CONFIG.CACHE_DURATION * 1000) {
                    return data;
                }
            }
        }
        
        let url = `${CONFIG.APPS_SCRIPT_URL}?action=${action}`;
        if (method === 'GET') {
            Object.keys(params).forEach(key => {
                url += `&${key}=${encodeURIComponent(params[key])}`;
            });
        }
        
        try {
            const response = await fetch(url, {
                method: method,
                ...(method === 'POST' && {
                    body: JSON.stringify(params),
                    headers: { 'Content-Type': 'application/json' }
                })
            });
            
            const data = await response.json();
            
            if (CONFIG.FEATURES.enableCache && data.status !== 'error') {
                sessionStorage.setItem(cacheKey, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            return { status: 'error', message: error.toString() };
        }
    },

    async getIncomeLimits(state, county, hhSize) {
        return this.callAPI('getIncomeLimits', { state, county, hhSize });
    },

    async checkProperty(zip) {
        return this.callAPI('checkProperty', { zip });
    },

    async getLenders(state, county) {
        return this.callAPI('getLenders', { state, county });
    },

    async getBlogPosts(limit = 5) {
        return this.callAPI('getBlogPosts', { limit });
    },

    async getBlogPost(slug) {
        return this.callAPI('getBlogPost', { slug });
    },

    async getStatePage(state) {
        return this.callAPI('getStatePage', { state });
    },

    async getCityPage(city, state) {
        return this.callAPI('getCityPage', { city, state });
    },

    async getFAQ(category = 'all', page = 'all') {
        return this.callAPI('getFAQ', { category, page });
    },

    async getPremiumOffers(page) {
        return this.callAPI('getPremiumOffers', { page });
    },

    async verifyPremium(email) {
        return this.callAPI('verifyPremium', { email });
    },

    async saveLead(email, name, phone, state, county, source) {
        return this.callAPI('saveLead', { 
            email, name, phone, state, county, source, 
            page: window.location.pathname 
        }, 'POST');
    },

    async trackPageView() {
        if (!CONFIG.FEATURES.enableAnalytics) return;
        return this.callAPI('trackPageView', {
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent
        }, 'POST');
    },

    async trackConversion(revenue) {
        if (!CONFIG.FEATURES.enableAnalytics) return;
        return this.callAPI('trackConversion', {
            page: window.location.pathname,
            revenue: revenue
        }, 'POST');
    }
};

document.addEventListener('DOMContentLoaded', () => API.trackPageView());
