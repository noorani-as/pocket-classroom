// learn.js
import { getProgress, saveProgress } from './storage.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

let currentCapsule = null;

// Predefined Intro to Web Design capsule
const defaultCapsule = {
    id: 'intro-web',
    meta: {
        title: 'Intro to Web Design',
        subject: 'Web Development',
        level: 'Beginner',
        description: 'Basics of HTML, CSS, JavaScript, and Bootstrap.'
    },
    notes: [
        'HTML is the structure of a webpage.',
        'CSS is used for styling the webpage.',
        'JavaScript adds interactivity.',
        'Bootstrap is a CSS framework for responsive design.'
    ],
    flashcards: [
        { front: 'What does HTML stand for?', back: 'HyperText Markup Language' },
        { front: 'What is the purpose of CSS?', back: 'To style and layout HTML elements' },
        { front: 'What is JavaScript used for?', back: 'To add interactivity to webpages' },
        { front: 'What is Bootstrap?', back: 'A framework for building responsive websites quickly' }
    ],
    quiz: [
        {
            question: 'Which tag is used for the main heading in HTML?',
            choices: ['<h1>', '<header>', '<title>', '<head>'],
            correct: 0
        },
        {
            question: 'Which property changes the text color in CSS?',
            choices: ['font-color', 'color', 'text-color', 'background-color'],
            correct: 1
        },
        {
            question: 'Which method is used to select an element by ID in JavaScript?',
            choices: ['getElementByClass', 'getElementById', 'querySelectorAll', 'getElementsByTagName'],
            correct: 1
        },
        {
            question: 'Bootstrap grid system is based on how many columns?',
            choices: ['8', '10', '12', '16'],
            correct: 2
        }
    ],
    schema: 'pocket-classroom/v1'
};

// Render Learn section
export function renderLearn() {
    const section = $('#section-learn');
    section.innerHTML = ''; // clear previous content

    // Save default capsule if not in LocalStorage
    let capsules = JSON.parse(localStorage.getItem('pc_capsules_index') || '[]');
    if (!capsules.some(c => c.id === defaultCapsule.id)) {
        localStorage.setItem(`pc_capsule_${defaultCapsule.id}`, JSON.stringify(defaultCapsule));
        capsules.push({
            id: defaultCapsule.id,
            title: defaultCapsule.meta.title,
            subject: defaultCapsule.meta.subject,
            level: defaultCapsule.meta.level,
            updatedAt: new Date().toISOString()
        });
        localStorage.setItem('pc_capsules_index', JSON.stringify(capsules));
    }

    if (capsules.length === 0) {
        section.innerHTML = `<p>No capsules found. Please create one in the Library.</p>`;
        return;
    }

    // Capsule selector
    const select = document.createElement('select');
    select.className = 'form-select mb-3';
    capsules.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.title;
        select.appendChild(option);
    });
    section.appendChild(select);

    select.addEventListener('change', () => {
        loadCapsule(select.value, section);
    });

    // Load first capsule by default
    loadCapsule(capsules[0].id, section);
}

// Load a capsule and render content
function loadCapsule(id, section) {
    currentCapsule = JSON.parse(localStorage.getItem(`pc_capsule_${id}`));
    const progress = getProgress(id) || {};

    section.innerHTML = '';

    // Capsule selector
    const capsules = JSON.parse(localStorage.getItem('pc_capsules_index') || '[]');
    const select = document.createElement('select');
    select.className = 'form-select mb-3';
    capsules.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.title;
        if (c.id === id) option.selected = true;
        select.appendChild(option);
    });
    section.appendChild(select);
    select.addEventListener('change', () => {
        loadCapsule(select.value, section);
    });

    // Meta Info
    const metaDiv = document.createElement('div');
    metaDiv.className = 'mb-3';
    metaDiv.innerHTML = `
        <h2>${currentCapsule.meta.title}</h2>
        <p>Subject: ${currentCapsule.meta.subject} | Level: ${currentCapsule.meta.level}</p>
        <p>${currentCapsule.meta.description}</p>
    `;
    section.appendChild(metaDiv);

    // Notes
    if (currentCapsule.notes && currentCapsule.notes.length > 0) {
        const notesDiv = document.createElement('div');
        notesDiv.className = 'card mb-3';
        notesDiv.innerHTML = `<div class="card-body"><h5>Notes</h5><ol>${currentCapsule.notes.map(n=>`<li>${n}</li>`).join('')}</ol></div>`;
        section.appendChild(notesDiv);
    }

    // Flashcards
    if (currentCapsule.flashcards && currentCapsule.flashcards.length > 0) {
        const flashDiv = document.createElement('div');
        flashDiv.className = 'mb-3';
        const fcTitle = document.createElement('h5');
        fcTitle.textContent = 'Flashcards';
        flashDiv.appendChild(fcTitle);

        let currentIndex = 0;
        const card = document.createElement('div');
        card.className = 'card text-center mb-2 p-3';
        card.style.cursor = 'pointer';
        card.textContent = currentCapsule.flashcards[currentIndex].front;

        const counter = document.createElement('p');
        counter.className = 'text-muted';
        counter.textContent = `Card ${currentIndex+1} of ${currentCapsule.flashcards.length}`;

        card.addEventListener('click', () => {
            const fc = currentCapsule.flashcards[currentIndex];
            card.textContent = card.textContent === fc.front ? fc.back : fc.front;
        });

        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-sm btn-primary me-2';
        nextBtn.textContent = 'Next';
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex+1) % currentCapsule.flashcards.length;
            const fc = currentCapsule.flashcards[currentIndex];
            card.textContent = fc.front;
            counter.textContent = `Card ${currentIndex+1} of ${currentCapsule.flashcards.length}`;
        });

        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn btn-sm btn-secondary me-2';
        prevBtn.textContent = 'Prev';
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex-1 + currentCapsule.flashcards.length) % currentCapsule.flashcards.length;
            const fc = currentCapsule.flashcards[currentIndex];
            card.textContent = fc.front;
            counter.textContent = `Card ${currentIndex+1} of ${currentCapsule.flashcards.length}`;
        });

        flashDiv.appendChild(card);
        flashDiv.appendChild(counter);
        flashDiv.appendChild(prevBtn);
        flashDiv.appendChild(nextBtn);
        section.appendChild(flashDiv);
    }

    // Quiz
    if (currentCapsule.quiz && currentCapsule.quiz.length > 0) {
        const quizDiv = document.createElement('div');
        quizDiv.className = 'mb-3';
        const quizTitle = document.createElement('h5');
        quizTitle.textContent = 'Quiz';
        quizDiv.appendChild(quizTitle);

        let qIndex = 0;
        const qDiv = document.createElement('div');
        const renderQuestion = () => {
            qDiv.innerHTML = '';
            if (qIndex >= currentCapsule.quiz.length) {
                qDiv.innerHTML = `<p>Quiz finished!</p>`;
                return;
            }
            const q = currentCapsule.quiz[qIndex];
            const questionP = document.createElement('p');
            questionP.textContent = `${qIndex+1}. ${q.question}`;
            qDiv.appendChild(questionP);

            q.choices.forEach((choice, i) => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline-primary me-2 mb-1';
                btn.textContent = choice;
                btn.addEventListener('click', () => {
                    if (i === q.correct) {
                        btn.classList.remove('btn-outline-primary');
                        btn.classList.add('btn-success');
                    } else {
                        btn.classList.remove('btn-outline-primary');
                        btn.classList.add('btn-danger');
                    }
                    setTimeout(() => {
                        qIndex++;
                        renderQuestion();
                    }, 700);
                });
                qDiv.appendChild(btn);
            });
        };
        renderQuestion();
        quizDiv.appendChild(qDiv);
        section.appendChild(quizDiv);
    }
}