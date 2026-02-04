/**
 * Quiz Stepper - Single Question at a Time
 * ¡Vamos Hablando! - Spanish Level Test
 */

document.addEventListener('DOMContentLoaded', () => {
    const quizStepper = document.getElementById('quiz-stepper');
    if (!quizStepper) return; // Not on quiz page

    // Configuration
    const TOTAL_QUESTIONS = 10;
    let currentStep = 1;
    const userAnswers = {};
    const quizUser = {
        name: '',
        email: ''
    };

    // DOM Elements
    const progressFill = document.getElementById('quiz-progress');
    const progressText = document.getElementById('quiz-progress-text');
    const steps = document.querySelectorAll('.quiz-step[data-step]');
    const resultsScreen = document.querySelector('.quiz-results-screen');
    const breakdownToggle = document.getElementById('breakdown-toggle');
    const breakdownList = document.getElementById('breakdown-list');
    const textInputSubmit = document.getElementById('q8-submit');
    const confettiContainer = document.getElementById('confetti-container');
    const introForm = document.getElementById('quiz-intro-form');
    const introCard = document.getElementById('quiz-intro-card');
    const nameInput = document.getElementById('quiz-full-name');
    const emailInput = document.getElementById('quiz-email');
    const requestAdviceBtn = document.getElementById('request-advice-btn');

    // Answer Key
    const answers = {
        q1: 'b',
        q2: 'b',
        q3: 'b',
        q4: 'c',
        q5: 'b',
        q6: 'c',
        q7: 'a',
        q8: ['nosotros comemos pan todos los días', 'nosotros comemos pan todos los dias', 'comemos pan todos los días', 'comemos pan todos los dias'],
        q9: 'b',
        q10: 'c'
    };

    // Question text for results breakdown
    const questions = {
        q1: 'Wat betekent "perro"?',
        q2: 'Vertaling: "Ik ga morgen naar school"',
        q3: 'Lidwoord voor "agua"',
        q4: 'Nosotros ___ español',
        q5: 'Betekenis van "¿Cuántos años tienes?"',
        q6: 'Verleden tijd: Ayer yo ___ una película',
        q7: 'Meervoud van "luz"',
        q8: 'Vertaling naar Spaans',
        q9: 'Grammaticaal correcte zin',
        q10: 'Wat betekent "aunque"?'
    };

    // Correct answer text for breakdown
    const correctTexts = {
        q1: 'Hond',
        q2: 'Yo iré mañana a la escuela',
        q3: 'el',
        q4: 'hablamos',
        q5: 'Hoe oud ben je?',
        q6: 'vi',
        q7: 'luces',
        q8: 'Nosotros comemos pan todos los días',
        q9: 'Me gustan los gatos',
        q10: 'Hoewel'
    };

    // Initialize
    clearAllSelections(); // Clear any browser-cached selections
    lockQuizUntilIntroComplete();
    updateProgress();
    setupOptionListeners();
    setupTextInputListener();
    setupBreakdownToggle();
    setupShareResults();
    setupRequestAdvice();

    /**
     * Clear all radio selections (prevents browser autofill highlighting)
     */
    function clearAllSelections() {
        document.querySelectorAll('.quiz-step-option input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
    }

    /**
     * Gate quiz access until name + email are provided
     */
    function lockQuizUntilIntroComplete() {
        if (!introForm || !quizStepper) return;

        document.body.classList.add('quiz-locked');
        quizStepper.setAttribute('aria-hidden', 'true');

        const validateName = () => {
            const value = nameInput ? nameInput.value.trim() : '';
            const isValid = value.length >= 2;
            setFieldState(nameInput, 'quiz-name-hint', isValid, 'Vul je volledige naam in.');
            return isValid;
        };

        const validateEmail = () => {
            const value = emailInput ? emailInput.value.trim() : '';
            const isValid = isValidEmail(value);
            setFieldState(emailInput, 'quiz-email-hint', isValid, 'Vul een geldig e-mailadres in.');
            return isValid;
        };

        nameInput?.addEventListener('blur', validateName);
        emailInput?.addEventListener('blur', validateEmail);
        nameInput?.addEventListener('input', () => {
            if (nameInput.classList.contains('error')) validateName();
        });
        emailInput?.addEventListener('input', () => {
            if (emailInput.classList.contains('error')) validateEmail();
        });

        introForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameOk = validateName();
            const emailOk = validateEmail();

            if (!nameOk || !emailOk) {
                if (!nameOk) {
                    nameInput?.focus();
                } else {
                    emailInput?.focus();
                }
                return;
            }

            quizUser.name = nameInput.value.trim();
            quizUser.email = emailInput.value.trim();
            window.quizUser = { ...quizUser };

            document.body.classList.remove('quiz-locked');
            quizStepper.setAttribute('aria-hidden', 'false');

            if (introCard) {
                introCard.setAttribute('aria-hidden', 'true');
            }

            quizStepper.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const firstInput = document.querySelector('.quiz-step.active input, .quiz-step.active button');
            firstInput?.focus();
        });

        nameInput?.focus();
    }

    function setFieldState(input, hintId, isValid, errorMessage) {
        if (!input) return;
        const hint = document.getElementById(hintId);
        if (hint && !hint.dataset.default) {
            hint.dataset.default = hint.textContent || '';
        }
        if (isValid) {
            input.classList.remove('error');
            if (hint) hint.textContent = hint.dataset.default || '';
        } else {
            input.classList.add('error');
            if (hint) hint.textContent = errorMessage;
        }
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    /**
     * Update progress bar and text
     */
    function updateProgress() {
        const percentage = (currentStep / TOTAL_QUESTIONS) * 100;
        if (progressFill) progressFill.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `Vraag ${currentStep} van ${TOTAL_QUESTIONS}`;
    }

    /**
     * Setup click listeners for radio options
     */
    function setupOptionListeners() {
        document.querySelectorAll('.quiz-step-option input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const questionName = e.target.name;
                const questionNumber = parseInt(questionName.replace('q', ''));
                const selectedValue = e.target.value;
                const currentStepEl = e.target.closest('.quiz-step');

                // Store answer
                userAnswers[questionName] = selectedValue;

                // Disable further interactions for this step
                currentStepEl.querySelectorAll('input').forEach(i => i.disabled = true);
                currentStepEl.querySelectorAll('.quiz-step-option').forEach(o => o.style.pointerEvents = 'none');

                // Determine correctness (handle arrays defensively)
                const correctAnswer = answers[questionName];
                let isCorrect = false;
                if (Array.isArray(correctAnswer)) {
                    isCorrect = correctAnswer.some(a => a.toLowerCase() === selectedValue.toLowerCase());
                } else {
                    isCorrect = selectedValue === correctAnswer;
                }

                // Mark correct option and mark selected as incorrect if needed
                currentStepEl.querySelectorAll('.quiz-step-option').forEach(opt => {
                    const input = opt.querySelector('input[type="radio"]');
                    if (!input) return;
                    const val = input.value;
                    opt.classList.remove('correct','incorrect');
                    if (Array.isArray(correctAnswer) ? correctAnswer.some(a => a.toLowerCase() === val.toLowerCase()) : val === correctAnswer) {
                        opt.classList.add('correct');
                    }
                });

                const selectedOption = e.target.closest('.quiz-step-option');
                if (!isCorrect) selectedOption.classList.add('incorrect');

                // Small scale animation on selected so feedback feels tactile
                selectedOption.style.transform = 'scale(1.02)';
                setTimeout(() => selectedOption.style.transform = '', 300);

                // Advance after short delay so user sees feedback
                setTimeout(() => {
                    // Clear states on previous step (so when revisiting it's clean)
                    currentStepEl.querySelectorAll('.quiz-step-option').forEach(o => {
                        o.classList.remove('correct','incorrect');
                        o.style.pointerEvents = '';
                        const input = o.querySelector('input[type="radio"]');
                        if (input) input.disabled = false;
                    });
                    goToNextStep(questionNumber);
                }, 800);
            });
        });
    }

    /**
     * Setup text input submit button for Q8
     */
    function setupTextInputListener() {
        if (!textInputSubmit) return;

        const textInput = document.querySelector('input[name="q8"]');
        const step8El = document.querySelector('.quiz-step[data-step="8"]');

        textInputSubmit.addEventListener('click', () => {
            if (textInput && textInput.value.trim()) {
                const answerVal = textInput.value.trim();
                userAnswers['q8'] = answerVal;

                // Disable further input
                textInput.disabled = true;
                textInputSubmit.disabled = true;

                // Check correctness against array of acceptable answers
                const correctList = answers['q8'];
                const isCorrect = Array.isArray(correctList) ? correctList.some(a => answerVal.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(answerVal.toLowerCase())) : answerVal.toLowerCase() === correctList.toLowerCase();

                // Apply visual feedback
                if (isCorrect) {
                    if (step8El) step8El.querySelector('.quiz-step-input')?.classList.add('correct');
                } else {
                    if (step8El) step8El.querySelector('.quiz-step-input')?.classList.add('incorrect');

                    // Show correct text below the input
                    let correctEl = step8El.querySelector('.quiz-correct-text');
                    if (!correctEl) {
                        correctEl = document.createElement('div');
                        correctEl.className = 'quiz-correct-text';
                        step8El.querySelector('.quiz-step-card')?.appendChild(correctEl);
                    }
                    correctEl.textContent = `Juist: ${correctTexts['q8']}`;
                }

                // Advance after short delay so user sees feedback
                setTimeout(() => {
                    // Clean state
                    if (step8El) {
                        step8El.querySelector('.quiz-step-input')?.classList.remove('correct','incorrect');
                        const correctEl = step8El.querySelector('.quiz-correct-text');
                        if (correctEl) correctEl.remove();
                        if (textInput) {
                            textInput.disabled = false;
                            textInput.value = '';
                        }
                        if (textInputSubmit) textInputSubmit.disabled = false;
                    }
                    goToNextStep(8);
                }, 900);

            } else {
                // Shake animation if empty
                textInput.style.animation = 'shake 0.5s ease';
                setTimeout(() => textInput.style.animation = '', 500);
            }
        });

        // Also allow Enter key
        if (textInput) {
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    textInputSubmit.click();
                }
            });
        }
    }

    /**
     * Go to next step or show results
     */
    function goToNextStep(fromQuestion) {
        const currentStepEl = document.querySelector(`.quiz-step[data-step="${fromQuestion}"]`);
        
        if (fromQuestion >= TOTAL_QUESTIONS) {
            // Show results
            showResults();
        } else {
            // Go to next question
            currentStep = fromQuestion + 1;
            
            // Animate out current
            if (currentStepEl) {
                currentStepEl.style.animation = 'stepFadeOut 0.3s ease forwards';
                setTimeout(() => {
                    currentStepEl.classList.remove('active');
                    currentStepEl.style.animation = '';
                    
                    // Show next
                    const nextStepEl = document.querySelector(`.quiz-step[data-step="${currentStep}"]`);
                    if (nextStepEl) {
                        nextStepEl.classList.add('active');
                        updateProgress();
                    }
                }, 300);
            }
        }
    }

    /**
     * Calculate score and show results screen
     */
    function showResults() {
        let score = 0;
        const results = [];

        // Calculate score
        for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
            const qKey = `q${i}`;
            const userAnswer = userAnswers[qKey] || '';
            const correctAnswer = answers[qKey];
            let isCorrect = false;

            if (i === 8) {
                // Text input - flexible matching
                if (Array.isArray(correctAnswer)) {
                    isCorrect = correctAnswer.some(a => 
                        userAnswer.toLowerCase().includes(a.toLowerCase()) ||
                        a.toLowerCase().includes(userAnswer.toLowerCase())
                    );
                } else {
                    isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
                }
            } else {
                isCorrect = userAnswer === correctAnswer;
            }

            if (isCorrect) score++;
            
            results.push({
                question: i,
                isCorrect,
                questionText: questions[qKey],
                correctAnswer: correctTexts[qKey]
            });
        }

        // Hide current question, show results
        const currentStepEl = document.querySelector('.quiz-step.active');
        if (currentStepEl) {
            currentStepEl.style.animation = 'stepFadeOut 0.3s ease forwards';
            setTimeout(() => {
                currentStepEl.classList.remove('active');
                currentStepEl.style.animation = '';
                displayResults(score, results);
            }, 300);
        }
    }

    /**
     * Display results with animations
     */
    function displayResults(score, results) {
        // Hide progress
        if (progressFill && progressFill.parentElement) {
            progressFill.parentElement.parentElement.style.opacity = '0';
        }

        // Show results screen
        if (resultsScreen) {
            resultsScreen.classList.add('active');
        }

        // Animate score count up
        const scoreEl = document.getElementById('final-score');
        if (scoreEl) {
            animateScoreCount(scoreEl, score);
        }

        // Set title and subtitle based on score
        const titleEl = document.getElementById('results-title');
        const subtitleEl = document.getElementById('results-subtitle');
        
        if (titleEl && subtitleEl) {
            if (score === 10) {
                titleEl.textContent = '¡Perfecto!';
                subtitleEl.textContent = 'Je hebt alles goed beantwoord!';
            } else if (score >= 8) {
                titleEl.textContent = '¡Muy bien!';
                subtitleEl.textContent = 'Uitstekend resultaat!';
            } else if (score >= 5) {
                titleEl.textContent = 'Goed gedaan!';
                subtitleEl.textContent = 'Je bent op de goede weg';
            } else {
                titleEl.textContent = 'Geen zorgen!';
                subtitleEl.textContent = 'Iedereen begint ergens';
            }
        }

        // Set recommendation
        setRecommendation(score);

        // Build breakdown list
        buildBreakdown(results);

        // Trigger confetti for good scores
        if (score >= 5) {
            setTimeout(() => createConfetti(), 500);
        }
    }

    /**
     * Animate score counting up
     */
    function animateScoreCount(element, targetScore) {
        let current = 0;
        const duration = 1000;
        const increment = targetScore / (duration / 50);
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= targetScore) {
                current = targetScore;
                clearInterval(counter);
            }
            element.textContent = Math.round(current);
        }, 50);
    }

    /**
     * Set recommendation based on score
     */
    function setRecommendation(score) {
        const levelEl = document.getElementById('recommendation-level');
        const levelLink = document.getElementById('level-link');

        if (!levelEl) return;

        let anchor = 'niveau-start';

        if (score <= 4) {
            levelEl.textContent = 'Spaans spreken start';
            anchor = 'niveau-start';
        } else if (score <= 7) {
            levelEl.textContent = 'Spaans spreken verder';
            anchor = 'niveau-verder';
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

        const colors = ['#F6E6C8', '#CFE4EA', '#0B5F58', '#0E1A2B'];
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

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
