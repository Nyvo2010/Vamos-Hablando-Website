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
});
