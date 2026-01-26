/* File: js/main.js — Handles navbar scroll effect, mobile menu toggle, and active link highlighting */

document.addEventListener('DOMContentLoaded', () => { 
    // DOM elements used across interactions
    const navbar = document.querySelector('.navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    // Toggle 'scrolled' class on navbar when user scrolls past a threshold
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle mobile menu open/close and update body scroll and toggle icon
    const toggleMobileMenu = () => {
        const isOpen = mobileMenu.classList.toggle('open');
        document.body.style.overflow = isOpen ? 'hidden' : '';

        const icon = mobileMenuToggle.querySelector('svg');
        if (isOpen) {
            icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'; 
        } else {
            icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>'; 
        }
    }; 

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileMenuClose?.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when a mobile nav link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Highlight the current nav link based on the URL path
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === 'index.html' && href === '/')) {
            link.classList.add('active');
        }
    });

    // STACKED GALLERY INTERACTION
    document.addEventListener('bindGalleryEvents', function() { /* wrapper if you have an init function */ });

    // Run this logic when DOM is ready
    (function initGallery() {
        const galleryCards = document.querySelectorAll('.gallery-card');
        const galleryContainer = document.querySelector('.stacked-gallery');

        if (!galleryCards.length) return;

        // Handle clicks on cards (Logic for mobile/touch mainly)
        galleryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent document click from firing immediately

                const isActive = card.classList.contains('active');

                // Reset all cards first
                galleryCards.forEach(c => c.classList.remove('active'));

                // If it wasn't active, activate it. If it was active, we just closed it (toggle behavior)
                if (!isActive) {
                    card.classList.add('active');
                }
            });
        });

        // Close gallery when clicking outside
        document.addEventListener('click', (e) => {
            // If click is outside the container (or anywhere effectively since we stopPropagation on cards)
            galleryCards.forEach(c => c.classList.remove('active'));
        });
    })();
});
