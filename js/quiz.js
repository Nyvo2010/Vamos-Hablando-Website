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
    const quizStepper = document.getElementById('quiz-stepper');
    if (!quizStepper) return;

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
    const advicePanel = document.getElementById('quiz-advice-panel');
    const adviceForm = document.getElementById('advice-form');
    const adviceNameInput = document.getElementById('advice-name');
    const adviceEmailInput = document.getElementById('advice-email');
    const adviceNameHint = document.getElementById('advice-name-hint');
    const adviceEmailHint = document.getElementById('advice-email-hint');
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

        // Setup question options
        setupQuestionListeners();

        // Setup request advice flow
        setupRequestAdvice();

        // Start quiz immediately
        startQuiz();
    }

    // ============================================
    // QUIZ FLOW
    // ============================================
    function startQuiz() {
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
    function showResults() {
        // Hide all questions
        questions.forEach(q => q.classList.remove('active'));

        // Show results screen
        if (resultsScreen) {
             resultsScreen.classList.add('active');
             resultsScreen.style.display = 'block';
             resultsScreen.style.opacity = '1';
        }

        if (resultsScreen) {
            resultsScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const score = calculateScore();
        let levelData;

        if (score <= 14) {
            levelData = levels.start;
        } else if (score <= 20) {
            levelData = levels.startIntermediate;
        } else {
            levelData = levels.intermediate;
        }

        if (resultLevel) resultLevel.textContent = levelData.name;
        if (resultExplanation) resultExplanation.textContent = levelData.explanation;
        if (resultLink) resultLink.href = levelData.link;

        if (advicePanel) {
            advicePanel.classList.remove('open');
            advicePanel.setAttribute('aria-hidden', 'true');
        }

        if (adviceForm) {
            adviceForm.reset();
        }
        
        // Remove 'quiz-started' class to potentially allow header to show? 
        // No, user wants box to stay centered. 
        // But we might want to ensure resizing works.

        if (typeof createConfetti === 'function') {
            createConfetti();
        }

        // Keep request advice flow ready
    }

    function calculateScore() {
        let total = 0;
        for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
            if (answers[`q${i}`]) {
                total += answers[`q${i}`];
            }
        }
        return total;
    }


    // Question data for building email
    const questionData = [
        { label: 'Luistervaardigheid', question: 'Als iemand rustig Spaans tegen je praat, wat gebeurt er meestal?', options: { 1: 'Ik begrijp losse woorden of helemaal niets', 2: 'Ik begrijp de kern, maar mis veel details', 3: 'Ik begrijp het grootste deel en kan volgen' } },
        { label: 'Onbekende woorden', question: 'Hoe ga je om met onbekende woorden in een gesprek?', options: { 1: 'Dan raak ik het gesprek kwijt', 2: 'Ik blijf globaal volgen', 3: 'Ik kan vaak uit de context afleiden wat bedoeld wordt' } },
        { label: 'Eenvoudige dialoog', question: 'Kun je deelnemen aan een eenvoudige dialoog (bijv. kennismaken, iets bestellen)?', options: { 1: 'Nee, dat lukt nauwelijks', 2: 'Ja, met korte zinnen en veel nadenken', 3: 'Ja, redelijk vanzelfsprekend' } },
        { label: 'Spontaan spreken', question: 'Hoe voelt spreken in het moment?', options: { 1: 'Ik weet vaak niet wat ik moet zeggen', 2: 'Het lukt, maar langzaam', 3: 'Ik kan reageren zonder alles vooraf te bedenken' } },
        { label: 'Flexibiliteit', question: 'Wat gebeurt er als het gesprek iets afwijkt van wat je verwacht?', options: { 1: 'Dan loop ik vast', 2: 'Ik probeer me te redden', 3: 'Ik kan meestal blijven meedoen' } },
        { label: 'Ondersteuning', question: 'Hoeveel steun heb je nodig tijdens het spreken?', options: { 1: 'Veel begeleiding en herhaling', 2: 'Regelmatig houvast', 3: 'Beperkte ondersteuning' } },
        { label: 'Oplossend vermogen', question: 'Wat doe je als je iets wilt zeggen, maar niet op het juiste woord komt?', options: { 1: 'Ik loop vast en zeg niets', 2: 'Ik probeer het anders te verwoorden', 3: 'Ik blijf praten en los het op met andere woorden' } },
        { label: 'Doel', question: 'Wat wil je vooral leren?', options: { 1: 'Meedoen aan eenvoudige communicatie', 2: 'Zelfverzekerder en vlotter reageren', 3: 'Vrijer en gevarieerder communiceren' } },
        { label: 'Huidige uitdaging', question: 'Waar loop je nu tegenaan?', options: { 1: 'Ik kom niet goed op gang', 2: 'Ik wil uitbreiden wat ik al kan', 3: 'Ik wil verfijnen en verdiepen' } }
    ];

    /**
     * Setup request advice button
     */
    function setupRequestAdvice() {
        const requestAdviceBtn = document.getElementById('request-advice-btn');
        if (!requestAdviceBtn || !advicePanel || !adviceForm || !adviceNameInput || !adviceEmailInput) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        requestAdviceBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const isOpen = advicePanel.classList.toggle('open');
            advicePanel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

            if (isOpen) {
                adviceNameInput.focus();
            }
        });

        adviceForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = adviceNameInput.value.trim();
            const email = adviceEmailInput.value.trim();
            let valid = true;

            if (!name) {
                adviceNameInput.classList.add('error');
                adviceNameHint.textContent = 'Vul je naam in';
                valid = false;
            } else {
                adviceNameInput.classList.remove('error');
                adviceNameHint.textContent = '';
            }

            if (!email || !emailRegex.test(email)) {
                adviceEmailInput.classList.add('error');
                adviceEmailHint.textContent = 'Vul een geldig e-mailadres in';
                valid = false;
            } else {
                adviceEmailInput.classList.remove('error');
                adviceEmailHint.textContent = '';
            }

            if (!valid) return;

            user.name = name;
            user.email = email;

            const score = calculateScore();
            const levelData = score <= 14 ? levels.start : score <= 20 ? levels.startIntermediate : levels.intermediate;

            let emailBody = `Hallo!\n\nIk heb de niveautest van ¡Vamos Hablando! gemaakt en wil graag advies.\n\n`;
            emailBody += `Naam: ${user.name}\n`;
            emailBody += `E-mailadres: ${user.email}\n\n`;
            emailBody += `Aanbevolen niveau: ${levelData.name}\n`;
            emailBody += `Score: ${score}/${TOTAL_QUESTIONS * 3}\n\n`;
            emailBody += `--- Mijn antwoorden ---\n\n`;

            for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
                const answerValue = answers[`q${i}`];
                const qData = questionData[i - 1];
                const answerText = answerValue ? qData.options[answerValue] : '(niet beantwoord)';
                emailBody += `Vraag ${i}: ${qData.label}\n`;
                emailBody += `${qData.question}\n`;
                emailBody += `Antwoord: ${answerText}\n\n`;
            }

            emailBody += `---\n\nGraag hoor ik welke cursus het beste bij mij past.\n\nMet vriendelijke groet,\n${user.name}`;

            const subject = `Adviesaanvraag niveautest - ${user.name}`;
            const mailtoLink = `mailto:info@vamoshablando.nl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
            window.location.href = mailtoLink;
        });

        adviceNameInput.addEventListener('input', () => {
            adviceNameInput.classList.remove('error');
            adviceNameHint.textContent = '';
        });

        adviceEmailInput.addEventListener('input', () => {
            adviceEmailInput.classList.remove('error');
            adviceEmailHint.textContent = '';
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
