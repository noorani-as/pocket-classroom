// main.js  
import { renderLibrary } from './library.js';  
import { renderAuthor } from './author.js';  
import { renderLearn } from './learn.js';  

// DOM shortcuts  
const $ = (selector) => document.querySelector(selector);  
const $$ = (selector) => document.querySelectorAll(selector);  

// Sections  
const sectionLibrary = $('#section-library');  
const sectionAuthor = $('#section-author');  
const sectionLearn = $('#section-learn');  

// Navbar buttons  
const navLibrary = $('#nav-library');  
const navAuthor = $('#nav-author');  
const navLearn = $('#nav-learn');  

// Create fixed theme toggle button dynamically  
let themeToggle = document.createElement('button');  
themeToggle.id = 'theme-toggle';  
themeToggle.style.position = 'fixed';  
themeToggle.style.right = '20px';  
themeToggle.style.bottom = '70px'; // above footer  
themeToggle.style.zIndex = '1000';  
themeToggle.style.padding = '10px 15px';  
themeToggle.style.borderRadius = '50%';  
themeToggle.style.border = 'none';  
themeToggle.style.cursor = 'pointer';  
themeToggle.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';  
themeToggle.style.fontSize = '1.2rem';  
document.body.appendChild(themeToggle);  

// Theme  
const body = document.body;  
const savedTheme = localStorage.getItem('pc_theme') || 'light';  

// Apply saved theme on load  
if (savedTheme === 'dark') {  
    body.classList.add('dark-mode');  
    themeToggle.textContent = '☀'; // sun for dark mode  
    themeToggle.style.backgroundColor = '#444';  
    themeToggle.style.color = '#fff';  
} else {  
    themeToggle.textContent = '🌙'; // moon for light mode  
    themeToggle.style.backgroundColor = '#007bff';  // updated light mode background  
    themeToggle.style.color = '#fff'; // white text for better visibility  
}  

// Functions  
function showSection(section) {  
    sectionLibrary.classList.add('d-none');  
    sectionAuthor.classList.add('d-none');  
    sectionLearn.classList.add('d-none');  

    section.classList.remove('d-none');  
}  

// Event listeners  
navLibrary.addEventListener('click', () => {  
    showSection(sectionLibrary);  
    renderLibrary();  
});  

navAuthor.addEventListener('click', () => {  
    showSection(sectionAuthor);  
    renderAuthor();  
});  

navLearn.addEventListener('click', () => {  
    showSection(sectionLearn);  
    renderLearn();  
});  

// Theme toggle with icon change  
themeToggle.addEventListener('click', () => {  
    const isDark = body.classList.toggle('dark-mode');  
    themeToggle.textContent = isDark ? '☀' : '🌙';  
    localStorage.setItem('pc_theme', isDark ? 'dark' : 'light');  

    // Change button colors based on theme  
    if (isDark) {  
        themeToggle.style.backgroundColor = '#444';  
        themeToggle.style.color = '#fff';  
    } else {  
        themeToggle.style.backgroundColor = '#007bff';  // light mode background  
        themeToggle.style.color = '#fff';  
    }  
});  

// Automatically hide navbar in mobile when section clicked  
$$('.navbar-nav .nav-link').forEach(link => {  
    link.addEventListener('click', () => {  
        const navbarCollapse = $('.navbar-collapse');  
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {  
            navbarCollapse.classList.remove('show');  
        }  
    });  
});  

// Initial load  
showSection(sectionLibrary);  
renderLibrary();