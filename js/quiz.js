/*
  File: js/quiz.js
  Purpose: Niveautest logic — calculate quiz score, show feedback and display result message.
  Notes: Correct answers and display messages are defined at top; update carefully to preserve behavior.
*/
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-quiz');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', calculateScore);

   
    const answers = {
        q1: 'b',
        q2: 'b',
        q3: 'b',
        q4: 'c',
        q5: 'b',
        q6: 'c',
        q7: 'a',
        q8: ['nosotros comemos pan todos los días', 'nosotros comemos pan todos los dias'],
        q9: 'b',
        q10: 'c'
    };

   
    const correctTexts = {
        q1: 'Hond (b)',
        q2: 'Yo iré mañana a la escuela (b)',
        q3: 'el (b)',
        q4: 'hablamos (c)',
        q5: 'Hoe oud ben je? (b)',
        q6: 'vi (c)',
        q7: 'luces (a)',
        q8: 'Nosotros comemos pan todos los días',
        q9: 'Me gustan los gatos (b)',
        q10: 'Hoewel (c)'
    };

    /* calculateScore:
       Iterate over all questions, compare answers, update per-question feedback
       and show overall result message with a score popup.
    */
    function calculateScore() {
        let score = 0;
        let total = 10;
        
       
        document.querySelectorAll('.quiz-feedback').forEach(el => {
            el.innerHTML = '';
            el.style.display = 'none';
        });
        document.querySelectorAll('.quiz-card').forEach(card => {
            card.style.borderColor = 'var(--color-deep-navy)';
        });

       
        for (let i = 1; i <= 10; i++) {
            const qKey = 'q' + i;
            const correctAnswer = answers[qKey];
            const feedbackEl = document.getElementById(`feedback-${qKey}`);
            const cardEl = document.querySelector(`.quiz-card[data-q="${i}"]`);

            let isCorrect = false;
            let userAnswer = '';

           
            if (i === 8) {
               
                const input = document.querySelector(`input[name="${qKey}"]`);
                if (input) {
                    userAnswer = input.value.trim().toLowerCase();
                   
                    if (Array.isArray(correctAnswer)) {
                        isCorrect = correctAnswer.includes(userAnswer);
                    } else {
                        isCorrect = userAnswer === correctAnswer;
                    }
                }
            } else {
               
                const selected = document.querySelector(`input[name="${qKey}"]:checked`);
                if (selected) {
                    userAnswer = selected.value;
                    isCorrect = userAnswer === correctAnswer;
                }
            }

           
            if (isCorrect) {
                score++;
                if (cardEl) cardEl.style.borderColor = '#2e7d32';
                if (feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.innerHTML = '<span class="feedback-correct">✔ Correct!</span>';
                }
            } else {
                if (cardEl) cardEl.style.borderColor = '#c62828';
                if (feedbackEl) {
                    feedbackEl.style.display = 'block';
                    feedbackEl.innerHTML = `<span class="feedback-incorrect">✖ Fout.</span> Het juiste antwoord is: <strong>${correctTexts[qKey]}</strong>`;
                }
            }
        }

       
        const resultPopup = document.getElementById('quiz-result');
        const scoreDisplay = document.getElementById('score-display');
        const resultMessage = document.getElementById('result-message');
        
        if (resultPopup && scoreDisplay) {
            scoreDisplay.textContent = `${score} / ${total}`;
            resultPopup.style.display = 'block';
            
           
            if (score === 10) {
                resultMessage.textContent = '¡Fantástico! Je hebt alles goed! Je niveau is waarschijnlijk gevorderd.';
            } else if (score >= 7) {
                resultMessage.textContent = 'Adembenemend! Je hebt een goede basis. Ga zo door!';
            } else if (score >= 4) {
                resultMessage.textContent = 'Goed gedaan! Je weet al een aantal dingen, maar er is ruimte voor verbetering.';
            } else {
                resultMessage.textContent = 'Geen zorgen, iedereen moet ergens beginnen! ¡Vamos Hablando!';
            }

           
           
            resultPopup.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
           
            submitBtn.textContent = 'Opnieuw proberen';
            submitBtn.removeEventListener('click', calculateScore);
            submitBtn.addEventListener('click', () => window.location.reload());
        }
    }
});
