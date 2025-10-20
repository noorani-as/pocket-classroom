// storage.js

// Generate a unique ID
export function generateId() {
    return 'pc_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

// Get all capsules index
export function getCapsulesIndex() {
    const index = localStorage.getItem('pc_capsules_index');
    return index ? JSON.parse(index) : [];
}

// Save capsules index
export function saveCapsulesIndex(indexArray) {
    localStorage.setItem('pc_capsules_index', JSON.stringify(indexArray));
}

// Get a capsule by ID
export function getCapsule(id) {
    const data = localStorage.getItem(`pc_capsule_${id}`);
    return data ? JSON.parse(data) : null;
}

// Save a capsule
export function saveCapsule(capsule) {
    if (!capsule.id) {
        capsule.id = generateId();
    }
    capsule.updatedAt = new Date().toISOString();
    localStorage.setItem(`pc_capsule_${capsule.id}`, JSON.stringify(capsule));

    // Update index
    let index = getCapsulesIndex();
    const idx = index.findIndex(c => c.id === capsule.id);
    const entry = {
        id: capsule.id,
        title: capsule.meta.title,
        subject: capsule.meta.subject,
        level: capsule.meta.level,
        updatedAt: capsule.updatedAt
    };
    if (idx === -1) {
        index.push(entry);
    } else {
        index[idx] = entry;
    }
    saveCapsulesIndex(index);
    return capsule.id;
}

// Delete a capsule
export function deleteCapsule(id) {
    localStorage.removeItem(`pc_capsule_${id}`);
    localStorage.removeItem(`pc_progress_${id}`);
    let index = getCapsulesIndex();
    index = index.filter(c => c.id !== id);
    saveCapsulesIndex(index);
}

// Get progress
export function getProgress(id) {
    const data = localStorage.getItem(`pc_progress_${id}`);
    return data ? JSON.parse(data) : { bestScore: 0, knownFlashcards: [] };
}

// Save progress
export function saveProgress(id, progress) {
    localStorage.setItem(`pc_progress_${id}`, JSON.stringify(progress));
}

// Export capsule JSON
export function exportCapsuleJSON(id) {
    const capsule = getCapsule(id);
    if (!capsule) return;

    const blob = new Blob([JSON.stringify(capsule, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${capsule.meta.title.replace(/\s+/g,'_')}.json`;
    a.click();
}

// Import capsule JSON
export function importCapsuleJSON(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const capsule = JSON.parse(e.target.result);
            if (capsule.schema !== 'pocket-classroom/v1') {
                alert('Invalid schema.');
                return;
            }
            if (!capsule.meta || !capsule.meta.title) {
                alert('Invalid capsule format.');
                return;
            }
            // Generate new ID to avoid collision
            capsule.id = generateId();
            saveCapsule(capsule);
            if (callback) callback();
        } catch (err) {
            alert('Error parsing JSON: ' + err.message);
        }
    };
    reader.readAsText(file);
}