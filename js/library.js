// library.js
import { getCapsulesIndex, getCapsule, deleteCapsule, exportCapsuleJSON, importCapsuleJSON } from './storage.js';
import { renderAuthor } from './author.js';
import { renderLearn } from './learn.js';

const libraryContainer = document.getElementById('library-capsules');
const btnNew = document.getElementById('btn-new-capsule');
const btnImport = document.getElementById('btn-import-capsule');

// Utility: format date to "x minutes/hours ago"
function timeAgo(isoDate) {
    const now = new Date();
    const past = new Date(isoDate);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff/60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)} hours ago`;
    return `${Math.floor(diff/86400)} days ago`;
}

// Render Library
export function renderLibrary() {
    libraryContainer.innerHTML = '';
    const capsules = getCapsulesIndex();

    if (!capsules.length) {
        libraryContainer.innerHTML = '<p class="text-muted">No capsules yet. Create one using "New Capsule".</p>';
        return;
    }

    capsules.forEach(capsule => {
        const card = document.createElement('div');
        card.className = 'col-12 col-md-6 col-lg-4';
        card.innerHTML = `
            <div class="capsule-card p-3 h-100 d-flex flex-column justify-content-between">
                <div>
                    <h5>${capsule.title}</h5>
                    <span class="badge bg-primary">${capsule.level}</span>
                    <span class="badge bg-secondary">${capsule.subject}</span>
                    <p class="text-muted small mt-1">Updated: ${timeAgo(capsule.updatedAt)}</p>
                </div>
                <div class="mt-2 d-flex gap-2 flex-wrap">
                    <button class="btn btn-sm btn-success btn-learn">Learn</button>
                    <button class="btn btn-sm btn-warning btn-edit">Edit</button>
                    <button class="btn btn-sm btn-info btn-export">Export</button>
                    <button class="btn btn-sm btn-danger btn-delete">Delete</button>
                </div>
            </div>
        `;
        // Button actions
        card.querySelector('.btn-learn').addEventListener('click', () => {
            renderLearn(capsule.id);
            document.getElementById('section-library').classList.add('d-none');
            document.getElementById('section-learn').classList.remove('d-none');
        });

        card.querySelector('.btn-edit').addEventListener('click', () => {
            renderAuthor(capsule.id);
            document.getElementById('section-library').classList.add('d-none');
            document.getElementById('section-author').classList.remove('d-none');
        });

        card.querySelector('.btn-export').addEventListener('click', () => {
            exportCapsuleJSON(capsule.id);
        });

        card.querySelector('.btn-delete').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this capsule?')) {
                deleteCapsule(capsule.id);
                renderLibrary();
            }
        });

        libraryContainer.appendChild(card);
    });
}

// Top buttons
btnNew.addEventListener('click', () => {
    renderAuthor();
    document.getElementById('section-library').classList.add('d-none');
    document.getElementById('section-author').classList.remove('d-none');
});

btnImport.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            importCapsuleJSON(file, () => {
                alert('Capsule imported successfully!');
                renderLibrary();
            });
        }
    });
    input.click();
});