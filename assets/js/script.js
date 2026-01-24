document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            // Toggle sliding menu
            navLinks.classList.toggle('active');
            
            // Toggle rotation animation on icon
            hamburger.classList.toggle('active');
        });
    }
});
