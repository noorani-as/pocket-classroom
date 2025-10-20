// author.js
import { saveCapsule, getCapsule } from './storage.js';
import { renderLibrary } from './library.js';

const authorSection = document.getElementById('section-author');

let currentCapsuleId = null;
let autoSaveTimer = null;

export function renderAuthor(id = null) {
    currentCapsuleId = id;
    let capsule = id ? getCapsule(id) : {
        meta: { title: '', subject: '', level: 'Beginner', description: '' },
        notes: [],
        flashcards: [],
        quiz: [],
        schema: 'pocket-classroom/v1'
    };

    authorSection.innerHTML = `
        <h2>${id ? 'Edit Capsule' : 'New Capsule'}</h2>
        <form id="author-form" class="mb-3">
            <div class="mb-2">
                <label>Title *</label>
                <input type="text" class="form-control" id="capsule-title" value="${capsule.meta.title}">
            </div>
            <div class="mb-2">
                <label>Subject</label>
                <input type="text" class="form-control" id="capsule-subject" value="${capsule.meta.subject}">
            </div>
            <div class="mb-2">
                <label>Level</label>
                <select class="form-select" id="capsule-level">
                    <option ${capsule.meta.level==='Beginner'?'selected':''}>Beginner</option>
                    <option ${capsule.meta.level==='Intermediate'?'selected':''}>Intermediate</option>
                    <option ${capsule.meta.level==='Advanced'?'selected':''}>Advanced</option>
                </select>
            </div>
            <div class="mb-2">
                <label>Description</label>
                <textarea class="form-control" id="capsule-description" rows="2">${capsule.meta.description}</textarea>
            </div>

            <div class="mb-2">
                <label>Notes (one per line)</label>
                <textarea class="form-control" id="capsule-notes" rows="5">${capsule.notes.join('\n')}</textarea>
            </div>

            <div class="mb-2">
                <label>Flashcards</label>
                <div id="flashcards-container"></div>
                <button type="button" class="btn btn-sm btn-outline-secondary" id="btn-add-flashcard">Add Flashcard</button>
            </div>

            <div class="mb-2">
                <label>Quiz</label>
                <div id="quiz-container"></div>
                <button type="button" class="btn btn-sm btn-outline-secondary" id="btn-add-quiz">Add Question</button>
            </div>

            <button type="submit" class="btn btn-success mt-2">Save Capsule</button>
        </form>
    `;

    // Populate existing flashcards
    const fcContainer = document.getElementById('flashcards-container');
    capsule.flashcards.forEach((f, i) => addFlashcardRow(f.front, f.back));

    // Populate existing quiz
    const quizContainer = document.getElementById('quiz-container');
    capsule.quiz.forEach((q, i) => addQuizRow(q.question, q.choices, q.correct));

    // Flashcards: Add new row
    $('#btn-add-flashcard').addEventListener('click', () => addFlashcardRow());

    // Quiz: Add new question
    $('#btn-add-quiz').addEventListener('click', () => addQuizRow());

    // Auto-save on typing
    const form = document.getElementById('author-form');
    ['capsule-title','capsule-subject','capsule-level','capsule-description','capsule-notes'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            if(autoSaveTimer) clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(saveCapsuleData, 1000);
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveCapsuleData(true);
    });

    // ============================
    // Functions
    // ============================
    function addFlashcardRow(front='', back='') {
        const index = fcContainer.children.length;
        const row = document.createElement('div');
        row.className = 'mb-1';
        row.innerHTML = `
            <input type="text" class="form-control mb-1" placeholder="Front" value="${front}">
            <input type="text" class="form-control mb-1" placeholder="Back" value="${back}">
            <button type="button" class="btn btn-sm btn-danger mb-2">Remove</button>
        `;
        row.querySelector('button').addEventListener('click', () => row.remove());
        fcContainer.appendChild(row);
    }

    function addQuizRow(question='', choices=['','','',''], correct=0) {
        const index = quizContainer.children.length;
        const row = document.createElement('div');
        row.className = 'mb-2 p-2 border rounded';
        row.innerHTML = `
            <input type="text" class="form-control mb-1" placeholder="Question" value="${question}">
            <input type="text" class="form-control mb-1" placeholder="Choice A" value="${choices[0]}">
            <input type="text" class="form-control mb-1" placeholder="Choice B" value="${choices[1]}">
            <input type="text" class="form-control mb-1" placeholder="Choice C" value="${choices[2]}">
            <input type="text" class="form-control mb-1" placeholder="Choice D" value="${choices[3]}">
            <select class="form-select mb-1">
                <option value="0" ${correct===0?'selected':''}>Correct: A</option>
                <option value="1" ${correct===1?'selected':''}>Correct: B</option>
                <option value="2" ${correct===2?'selected':''}>Correct: C</option>
                <option value="3" ${correct===3?'selected':''}>Correct: D</option>
            </select>
            <button type="button" class="btn btn-sm btn-danger">Remove</button>
        `;
        row.querySelector('button').addEventListener('click', () => row.remove());
        quizContainer.appendChild(row);
    }

    function saveCapsuleData(showAlert=false) {
        const title = $('#capsule-title').value.trim();
        const subject = $('#capsule-subject').value.trim();
        const level = $('#capsule-level').value;
        const description = $('#capsule-description').value.trim();
        const notes = $('#capsule-notes').value.split('\n').map(n => n.trim()).filter(n=>n);

        if (!title) { alert('Title is required.'); return; }
        if (!notes.length && fcContainer.children.length===0 && quizContainer.children.length===0) {
            alert('Please add at least notes, flashcards, or quiz questions.');
            return;
        }

        // Flashcards
        const flashcards = Array.from(fcContainer.children).map(row => {
            const inputs = row.querySelectorAll('input');
            const front = inputs[0].value.trim();
            const back = inputs[1].value.trim();
            return front && back ? { front, back } : null;
        }).filter(f => f);

        // Quiz
        const quiz = Array.from(quizContainer.children).map(row => {
            const inputs = row.querySelectorAll('input');
            const question = inputs[0].value.trim();
            const choices = [inputs[1].value, inputs[2].value, inputs[3].value, inputs[4].value].map(c => c.trim());
            const correct = parseInt(row.querySelector('select').value);
            return question && choices.every(c => c) ? { question, choices, correct } : null;
        }).filter(q => q);

        const capsuleData = { id: currentCapsuleId, meta:{title,subject,level,description}, notes, flashcards, quiz, schema:'pocket-classroom/v1' };
        currentCapsuleId = saveCapsule(capsuleData);

        if(showAlert){
            alert('Capsule saved successfully!');
            renderLibrary();
            $('#section-author').classList.add('d-none');
            $('#section-library').classList.remove('d-none');
        }
    }
}

// Shortcut $
function $(selector) { return document.querySelector(selector); }