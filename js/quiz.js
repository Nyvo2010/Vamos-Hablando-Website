document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-quiz');
    if (!submitBtn) return; // Not on quiz page/mode

    submitBtn.addEventListener('click', calculateScore);

    // Answer Key
    const answers = {
        q1: 'b',
        q2: 'b',
        q3: 'b',
        q4: 'c',
        q5: 'b',
        q6: 'c',
        q7: 'a',
        q8: ['nosotros comemos pan todos los días', 'nosotros comemos pan todos los dias', 'Nosotros comemos pan todos los dias', 'Nosotros comemos pan todos los días'], // accept with/without accent
        q9: 'b',
        q10: 'c'
    };

    // Correct text representations for feedback
    const correctTexts = {
        q1: 'b, (Hond) ',
        q2: 'b, Yo iré mañana a la escuela',
        q3: 'b, el',
        q4: 'c, hablamos',
        q5: 'b, Hoe oud ben je?',
        q6: 'c, vi',
        q7: 'a, luces',
        q8: 'Nosotros comemos pan todos los días',
        q9: 'b, Me gustan los gatos',
        q10: 'c, Hoewel'
    };

    function calculateScore() {
        let score = 0;
        let total = 10;
        
        // Reset old feedback
        document.querySelectorAll('.quiz-feedback').forEach(el => {
            el.innerHTML = '';
            el.style.display = 'none';
        });
        document.querySelectorAll('.quiz-card').forEach(card => {
            card.style.border = 'none'; // Reset border
        });

        // Loop questions 1 to 10
        for (let i = 1; i <= 10; i++) {
            const qKey = 'q' + i;
            const correctAnswer = answers[qKey];
            const feedbackEl = document.getElementById(`feedback-${qKey}`);
            const cardEl = document.querySelector(`.quiz-card[data-q="${i}"]`);

            let isCorrect = false;
            let userAnswer = '';

            // Handle Input vs Radio
            if (i === 8) {
                // Text input
                const input = document.querySelector(`input[name="${qKey}"]`);
                if (input) {
                    userAnswer = input.value.trim().toLowerCase();
                    // Check inclusion in array or simple match
                    if (Array.isArray(correctAnswer)) {
                        isCorrect = correctAnswer.includes(userAnswer);
                    } else {
                        isCorrect = userAnswer === correctAnswer;
                    }
                }
            } else {
                // Radio
                const selected = document.querySelector(`input[name="${qKey}"]:checked`);
                if (selected) {
                    userAnswer = selected.value;
                    isCorrect = userAnswer === correctAnswer;
                }
            }

            // Update Score & Feedback
            if (isCorrect) {
                score++;
                if (cardEl) cardEl.style.border = '2px solid #69f0ae'; // Light green border
                if (feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.innerHTML = '<span class="feedback-correct">✔ Correct!</span>';
                }
            } else {
                if (cardEl) cardEl.style.border = '2px solid #ff8a80'; // Light red border
                if (feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.innerHTML = `<span class="feedback-incorrect">✖ Fout.</span> Het juiste antwoord is: <strong>${correctTexts[qKey]}</strong>`;
                }
            }
        }

        // Show Result
        const resultPopup = document.getElementById('quiz-result');
        const scoreDisplay = document.getElementById('score-display');
        const resultMessage = document.getElementById('result-message');
        
        if (resultPopup && scoreDisplay) {
            scoreDisplay.textContent = score;
            resultPopup.style.display = 'block';

            // Email handler
            const sendBtn = document.getElementById('send-score-btn');
            const emailInput = document.getElementById('user-email');

            if (sendBtn && emailInput) {
                // Reset button state on new calculation
                sendBtn.textContent = 'Verstuur naar ons';
                sendBtn.disabled = false;
                
                sendBtn.onclick = (e) => {
                   e.preventDefault();
                   const email = emailInput.value.trim();
                   if (!email || !email.includes('@')) {
                       alert('Vul een geldig e-mailadres in.');
                       return;
                   }
                   
                   const subject = `Niveautest Resultaat: ${score} punten`;
                   // Construct body with clear user info for the receiver
                   const body = `Hola,\n\nIk heb zojuist de niveautest gedaan op de website.\n\nMijn score is: ${score} (van de 10).\n\nIk ontvang graag advies over welk niveau bij mij past.\n\nMijn e-mailadres is: ${email}\n\nGroetjes!`;
                   
                   // Use mailto to open default mail client
                   window.location.href = `mailto:info@vamoshablando.nl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                   
                   sendBtn.textContent = 'Even geduld...';
                   setTimeout(() => {
                        sendBtn.textContent = 'Geopend in mail app';
                   }, 1500);
                };
            }
            
            // Customized message & Recommendation
            let recommendationTitle = "";
            let recommendationText = "";

            if (score <= 4) {
                 recommendationTitle = "Spaans spreken start";
                 recommendationText = "Je staat aan het begin van je reis. Deze cursus helpt je de basis te leggen.";
            } else if (score <= 8) {
                 recommendationTitle = "Spaans spreken verder";
                 recommendationText = "Je hebt de basis onder de knie! Tijd om je vaardigheden uit te breiden.";
            } else {
                 recommendationTitle = "Spaans spreken verdieping";
                 recommendationText = "Uitstekend! Je bent klaar voor verdiepende conversaties en complexe structuren.";
            }

            let introText = "Geen zorgen, iedereen begint ergens.";
            if (score === 10) introText = "¡Fantástico! Je hebt alles goed!";
            else if (score >= 7) introText = "Muy bien! Je bent goed op weg.";
            else if (score >= 5) introText = "Goed gedaan!";

            resultMessage.innerHTML = `
                ${introText}
                <div class="recommendation-highlight">
                    <span class="recommendation-title">Wij raden aan: ${recommendationTitle}</span>
                    <span>${recommendationText}</span>
                </div>
            `;

            // Hide the form slightly or keep it visible?
            // Let's scroll to the result
            resultPopup.scrollIntoView({ behavior: 'smooth', block: 'center' });

            
            // Disable button
            submitBtn.textContent = 'Opnieuw proberen';
            submitBtn.removeEventListener('click', calculateScore);
            submitBtn.addEventListener('click', () => window.location.reload());
        }
    }
});
