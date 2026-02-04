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
            return levels.intermediate;
        }
    }

    function showResults() {
        // Hide all questions
        questions.forEach(q => q.classList.remove('active'));

        // Calculate result
        const score = calculateScore();
        const level = getLevel(score);

        // Update UI
        resultLevel.textContent = level.name;
        resultExplanation.textContent = level.explanation;
        resultLink.href = level.link;

        // Show results
        resultsScreen.classList.add('active');
    }
});
