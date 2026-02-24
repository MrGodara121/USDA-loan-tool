// premium.js - Premium Features
const PREMIUM = {
    async checkStatus(email) {
        if (!email) return false;
        const data = await API.verifyPremium(email);
        return data.isPremium || false;
    },

    showPremiumContent() {
        document.querySelectorAll('.premium-content').forEach(el => el.style.display = 'block');
        document.querySelectorAll('.free-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.premium-teaser').forEach(el => el.style.display = 'none');
    },

    showPaywall() {
        document.querySelectorAll('.premium-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.free-content').forEach(el => el.style.display = 'block');
        document.querySelectorAll('.premium-teaser').forEach(el => el.style.display = 'block');
    },

    async init() {
        const userEmail = localStorage.getItem('premiumEmail');
        
        if (userEmail) {
            const isPremium = await this.checkStatus(userEmail);
            if (isPremium) {
                this.showPremiumContent();
            } else {
                this.showPaywall();
            }
        } else {
            this.showPaywall();
        }
    },

    async checkout(plan = 'annual') {
        const email = prompt('Enter your email to continue:');
        if (!email) return;
        
        localStorage.setItem('premiumEmail', email);
        const isPremium = await this.checkStatus(email);
        
        if (isPremium) {
            alert('You already have premium access! Redirecting to dashboard...');
            window.location.href = '/premium/';
            return;
        }
        
        window.location.href = `/premium/checkout.html?plan=${plan}&email=${encodeURIComponent(email)}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.premium-content, .premium-teaser')) {
        PREMIUM.init();
    }
});
