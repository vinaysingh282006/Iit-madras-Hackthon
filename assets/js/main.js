// Main JavaScript file for RoadSphere AI

// DOM Elements
const speedSlider = document.getElementById('speedSlider');
const trafficSlider = document.getElementById('trafficSlider');
const speedValue = document.getElementById('speedValue');
const trafficValue = document.getElementById('trafficValue');

// Update slider values display
if (speedSlider && speedValue) {
    speedSlider.addEventListener('input', () => {
        speedValue.textContent = speedSlider.value;
    });
}

if (trafficSlider && trafficValue) {
    trafficSlider.addEventListener('input', () => {
        trafficValue.textContent = trafficSlider.value;
    });
}

// Navigation active state
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop();
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Utility Functions
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
    }
}

function hideSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('hidden');
    }
}

// Local Storage Functions
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

// Export functions for use in other modules
window.RoadSphere = {
    showSection,
    hideSection,
    saveToLocalStorage,
    loadFromLocalStorage
};