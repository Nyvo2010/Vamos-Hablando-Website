/**
 * Quiz - Self-Assessment Level Test
 * ¡Vamos Hablando! - Spanish Level Self-Assessment
 * 
 * SCORING LOGIC:
 * - 9 questions, each with 3 options worth 1, 2, or 3 points
 * - Total range: 9 (minimum) to 27 (maximum)
 * 
 * LEVEL CALCULATION:
 * - Score 9-14:  Start Groep
 * - Score 15-20: Start Groep / Gevorderde Groep  
 * - Score 21-27: Gevorderde Groep / Privélessen
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the quiz page
    const quizIntro = document.getElementById('quiz-intro-card');
    if (!quizIntro) return;

    // ============================================
    // STATE
    // ============================================
    const TOTAL_QUESTIONS = 9;
    let currentQuestion = 0;
    const answers = {};
    const user = { name: '', email: '' };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const introForm = document.getElementById('intro-form');
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const nameHint = document.getElementById('name-hint');
    const emailHint = document.getElementById('email-hint');
    const questions = document.querySelectorAll('.quiz-step');
    const resultsScreen = document.getElementById('quiz-results');
    const resultLevel = document.getElementById('result-level');
    const resultExplanation = document.getElementById('result-explanation');
    const resultLink = document.getElementById('result-link');

    // ============================================
    // LEVEL DEFINITIONS
    // ============================================
    const levels = {
        start: {
            name: 'Startgroep',
            explanation: 'Je werkt aan de basis van functioneren in het Spaans: begrijpen, reageren en meedoen aan eenvoudige communicatie.',
            link: 'groepslessen.html#niveau-start'
        },
        startIntermediate: {
            name: 'Startgroep of vervolggroep',
            explanation: 'Je kunt al meedoen, maar hebt baat bij verdere opbouw en begeleiding. Twijfel je tussen start en verder? Dan is de startgroep vaak de beste keuze.',
            link: 'groepslessen.html#niveau-verder'
        },
        intermediate: {
            name: 'Vervolggroep of privéles',
            explanation: 'Je communiceert al redelijk zelfstandig en wilt meer variatie, tempo en verdieping.',
            link: 'groepslessen.html#niveau-verdieping'
        }
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    init();

    function init() {
        // Clear any browser-cached selections
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });

        // Setup intro form
        setupIntroForm();

        // Setup question options
        setupQuestionListeners();
    }

    // ============================================
    // INTRO FORM
    // ============================================
    function setupIntroForm() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        introForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            let valid = true;

            // Validate name
            if (!name) {
                nameInput.classList.add('error');
                nameHint.textContent = 'Vul je naam in';
                valid = false;
            } else {
                nameInput.classList.remove('error');
                nameHint.textContent = '';
            }

            // Validate email
            if (!email || !emailRegex.test(email)) {
                emailInput.classList.add('error');
                emailHint.textContent = 'Vul een geldig e-mailadres in';
                valid = false;
            } else {
                emailInput.classList.remove('error');
                emailHint.textContent = '';
            }

            if (!valid) return;

            // Store user data
            user.name = name;
            user.email = email;

            // Start quiz
            startQuiz();
        });

        // Clear errors on input
        nameInput.addEventListener('input', () => {
            nameInput.classList.remove('error');
            nameHint.textContent = '';
        });

        emailInput.addEventListener('input', () => {
            emailInput.classList.remove('error');
            emailHint.textContent = '';
        });
    }

    // ============================================
    // QUIZ FLOW
    // ============================================
    function startQuiz() {
        // Unlock quiz view
        document.body.classList.remove('quiz-locked');
        document.body.classList.add('quiz-started');
        
        // Make stepper visible for screen readers
        const stepper = document.getElementById('quiz-stepper');
        if (stepper) {
            stepper.setAttribute('aria-hidden', 'false');
        }

        // Show first question
        currentQuestion = 1;
        showQuestion(1);
    }

    function showQuestion(num) {
        // Hide all questions
        questions.forEach(q => q.classList.remove('active'));

        // Show target question
        const target = document.querySelector(`.quiz-step[data-question="${num}"]`);
        if (target) {
            target.classList.add('active');
        }
    }

    function setupQuestionListeners() {
        document.querySelectorAll('.quiz-step-option').forEach(option => {
            option.addEventListener('click', () => {
                const radio = option.querySelector('input[type="radio"]');
                if (!radio) return;

                const questionNum = parseInt(option.closest('.quiz-step').dataset.question);
                const value = parseInt(radio.value);

                // Store answer
                answers[`q${questionNum}`] = value;

                // Visual feedback
                const siblings = option.closest('.quiz-step-options').querySelectorAll('.quiz-step-option');
                siblings.forEach(s => s.classList.remove('selected'));
                option.classList.add('selected');

                // Advance after short delay
                setTimeout(() => {
                    if (questionNum < TOTAL_QUESTIONS) {
                        currentQuestion = questionNum + 1;
                        showQuestion(currentQuestion);
                    } else {
                        showResults();
                    }
                }, 350);
            });
        });
    }

    // ============================================
    // RESULTS
    // ============================================
    function calculateScore() {
        let total = 0;
        for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
            if (answers[`q${i}`]) {
                total += answers[`q${i}`];
            }
        }
        return total;
    }

    function getLevel(score) {
        if (score <= 14) {
            return levels.start;
        } else if (score <= 20) {
            return levels.startIntermediate;
        } else {
            levelEl.textContent = 'Spaans spreken verdieping';
            anchor = 'niveau-verdieping';
        }

        // Update link to scroll to correct level section
        if (levelLink) {
            levelLink.href = `groepslessen.html#${anchor}`;
        }
    }

    /**
     * Build the answer breakdown list
     */
    function buildBreakdown(results) {
        if (!breakdownList) return;

        breakdownList.innerHTML = results.map(r => `
            <div class="breakdown-item">
                <div class="breakdown-icon ${r.isCorrect ? 'correct' : 'incorrect'}">
                    <span class="material-symbols-rounded">${r.isCorrect ? 'check' : 'close'}</span>
                </div>
                <div class="breakdown-text">
                    <div class="breakdown-question">Vraag ${r.question}: ${r.questionText}</div>
                    <div class="breakdown-answer">${r.isCorrect ? 'Correct!' : `Juist: ${r.correctAnswer}`}</div>
                </div>
            </div>
        `).join('');

        // Store results for sharing
        window.quizResults = results;
    }

    /**
     * Setup share results button
     */
    function setupShareResults() {
        const shareBtn = document.getElementById('share-results-btn');
        if (!shareBtn) return;

        shareBtn.addEventListener('click', () => {
            if (!quizUser.name || !quizUser.email) {
                alert('Vul eerst je naam en e-mailadres in om de resultaten te versturen.');
                return;
            }

            const scoreEl = document.getElementById('final-score');
            const levelEl = document.getElementById('recommendation-level');
            const score = scoreEl ? scoreEl.textContent : '?';
            const level = levelEl ? levelEl.textContent : 'Onbekend';
            
            // Build email body with results
            let emailBody = `Hallo!\n\nMijn naam is ${quizUser.name} en ik heb de niveautest van ¡Vamos Hablando! gemaakt.\n`;
            emailBody += `Mijn e-mailadres: ${quizUser.email}\n\n`;
            emailBody += `Mijn score: ${score}/10\n`;
            emailBody += `Aanbevolen niveau: ${level}\n\n`;
            
            if (window.quizResults) {
                emailBody += `Antwoorden:\n`;
                window.quizResults.forEach(r => {
                    const status = r.isCorrect ? '✓' : '✗';
                    emailBody += `${status} Vraag ${r.question}: ${r.isCorrect ? 'Correct' : 'Fout (juist: ' + r.correctAnswer + ')'}\n`;
                });
            }
            
            emailBody += `\nGraag hoor ik van u welke cursus het beste bij mij past.\n\nMet vriendelijke groet,\n${quizUser.name}`;
            
            // Open email client
            const mailtoLink = `mailto:info@vamoshablando.nl?subject=${encodeURIComponent('Niveautest resultaat - ' + quizUser.name)}&body=${encodeURIComponent(emailBody)}`;
            window.location.href = mailtoLink;
        });
    }

    /**
     * Setup request advice button
     */
    function setupRequestAdvice() {
        if (!requestAdviceBtn) return;

        requestAdviceBtn.addEventListener('click', () => {
            if (!quizUser.name || !quizUser.email) {
                alert('Vul eerst je naam en e-mailadres in om advies aan te vragen.');
                return;
            }

            const scoreEl = document.getElementById('final-score');
            const levelEl = document.getElementById('recommendation-level');
            const score = scoreEl ? scoreEl.textContent : '?';
            const level = levelEl ? levelEl.textContent : 'Onbekend';

            let emailBody = `Hallo!\n\nIk wil graag advies naar aanleiding van mijn niveautest.\n\n`;
            emailBody += `Naam: ${quizUser.name}\n`;
            emailBody += `E-mailadres: ${quizUser.email}\n\n`;
            emailBody += `Score: ${score}/10\n`;
            emailBody += `Aanbevolen niveau: ${level}\n\n`;

            if (window.quizResults) {
                emailBody += `Antwoorden:\n`;
                window.quizResults.forEach(r => {
                    const status = r.isCorrect ? '✓' : '✗';
                    emailBody += `${status} Vraag ${r.question}: ${r.isCorrect ? 'Correct' : 'Fout (juist: ' + r.correctAnswer + ')'}\n`;
                });
            }

            emailBody += `\nMet vriendelijke groet,\n${quizUser.name}`;

            const subject = `Adviesaanvraag niveautest - ${quizUser.name}`;
            const mailtoLink = `mailto:info@vamoshablando.nl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
            window.location.href = mailtoLink;
        });
    }

    /**
     * Setup breakdown toggle functionality
     */
    function setupBreakdownToggle() {
        if (!breakdownToggle || !breakdownList) return;

        breakdownToggle.addEventListener('click', () => {
            breakdownToggle.classList.toggle('open');
            breakdownList.classList.toggle('open');
        });
    }

    /**
     * Create confetti celebration effect
     */
    function createConfetti() {
        if (!confettiContainer) return;

        const colors = ['#F6E6C8', '#CFE4EA', '#0B5F58', '#69f0ae', '#ffeb3b'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
            confetti.style.width = `${8 + Math.random() * 8}px`;
            confetti.style.height = `${8 + Math.random() * 8}px`;
            confettiContainer.appendChild(confetti);
        }

        // Clean up confetti after animation
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 5000);
    }
});
