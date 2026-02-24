// ===== Mobile Menu Functions =====
// Add this to all pages that have mobile menu

function toggleMenu() {
    const nav = document.getElementById('mainNav');
    const btn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.menu-overlay');
    if (nav) nav.classList.toggle('active');
    if (btn) btn.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

// Close menu when clicking a link
document.addEventListener('click', function(e) {
    const nav = document.getElementById('mainNav');
    const btn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.menu-overlay');
    
    if (nav && nav.classList.contains('active')) {
        if (e.target.tagName === 'A' || e.target.closest('nav')) {
            if (!e.target.closest('.mobile-menu-btn')) {
                nav.classList.remove('active');
                if (btn) btn.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
            }
        }
    }
});
