// main.js - Main JavaScript file
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

async function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail')?.value;
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email');
        return false;
    }
    
    await API.saveLead(email, '', '', '', '', 'newsletter');
    alert('Thanks for subscribing! Check your email for updates.');
    if (document.getElementById('newsletterEmail')) {
        document.getElementById('newsletterEmail').value = '';
    }
    return false;
}

const backToTop = document.createElement('button');
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTop.className = 'back-to-top';
backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
});
