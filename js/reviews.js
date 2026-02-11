document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.getElementById('reviews-container');
    
    // Only proceed if the container exists
    if (!reviewsContainer) return;

    fetch('data/reviews.json')
        .then(response => response.json())
        .then(reviews => {
            renderReviews(reviews, reviewsContainer);
        })
        .catch(error => {
            console.error('Error loading reviews:', error);
            reviewsContainer.innerHTML = '<p class="text-body opacity-80">Recensies konden niet worden geladen.</p>';
        });
});

function renderReviews(reviews, container) {
    container.innerHTML = ''; // Clear loading text/placeholders

    reviews.forEach(review => {
        const article = document.createElement('article');
        article.className = 'card card-scale text-left';
        
        // Generate stars HTML
        let starsHtml = '<div class="stars-container mb-2" style="display: flex; gap: 0.25rem;">';
        for (let i = 0; i < 5; i++) {
            if (i < review.stars) {
                // Filled star
                starsHtml += '<span class="material-symbols-rounded accent" style="font-size: 1.25rem;">star</span>';
            } else {
                // Empty/outlined star
                starsHtml += '<span class="material-symbols-rounded accent" style="font-size: 1.25rem; opacity: 0.3;">star</span>';
            }
        }
        starsHtml += '</div>';

        article.innerHTML = `
            ${starsHtml}
            <p class="text-small opacity-80 mb-2"><strong>${review.name}</strong> · ${review.role}</p>
            <p>"${review.text}"</p>
        `;

        container.appendChild(article);
    });
}
