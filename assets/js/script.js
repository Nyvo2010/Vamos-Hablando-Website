document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle hamburger animation if needed (simple x)
            // Not strictly required for MVP functional
        });
    }

    // Header scroll background change (optional refinement)
    // For now we keep it sticky and consistent based on page template
});
