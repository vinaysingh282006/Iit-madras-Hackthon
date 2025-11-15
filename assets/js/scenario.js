// Scenario Analysis Module for RoadSphere AI

// DOM Elements
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsSection = document.getElementById('resultsSection');
const problemSummary = document.getElementById('problemSummary');
const possibleCauses = document.getElementById('possibleCauses');
const riskScoreValue = document.getElementById('riskScoreValue');
const riskScoreBar = document.getElementById('riskScoreBar');
const interventionsList = document.getElementById('interventions');

// Analyze scenario function
async function analyzeScenario() {
    // Get form values
    const roadType = document.getElementById('roadType').value;
    const issueType = document.getElementById('issueType').value;
    const environment = document.getElementById('environment').value;
    const speed = parseInt(document.getElementById('speedSlider').value);
    const traffic = parseInt(document.getElementById('trafficSlider').value);
    const description = document.getElementById('description').value;
    
    // Show loading state
    analyzeBtn.textContent = 'Analyzing...';
    analyzeBtn.disabled = true;
    
    try {
        // Import Gemini functions
        await loadGeminiModule();
        
        // Call Gemini API for analysis
        const analysis = await window.RoadSphereGemini.analyzeScenarioWithAI(
            roadType, issueType, environment, speed, traffic, description
        );
        
        // Display results
        displayResults(analysis);
        
        // Save to localStorage for use in other pages
        window.RoadSphere.saveToLocalStorage('lastAnalysis', analysis);
        
        // Show results section
        resultsSection.classList.remove('hidden');
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error during analysis:', error);
        // Show error in results
        displayError("Failed to analyze scenario. Please try again.");
    } finally {
        // Reset button
        analyzeBtn.textContent = 'Analyze Scenario';
        analyzeBtn.disabled = false;
    }
}

// Load Gemini module dynamically
function loadGeminiModule() {
    return new Promise((resolve, reject) => {
        if (window.RoadSphereGemini) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'assets/js/gemini.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Gemini module'));
        document.head.appendChild(script);
    });
}

// Display results function
function displayResults(data) {
    // Problem summary
    problemSummary.textContent = data.problem || "Analysis complete";
    
    // Possible causes
    possibleCauses.innerHTML = '';
    if (data.causes && Array.isArray(data.causes)) {
        data.causes.forEach(cause => {
            const li = document.createElement('li');
            li.textContent = cause;
            possibleCauses.appendChild(li);
        });
    }
    
    // Risk score
    const riskScore = data.riskScore || 0;
    riskScoreValue.textContent = riskScore;
    riskScoreBar.style.width = `${riskScore}%`;
    
    // Color code risk bar
    riskScoreBar.className = 'risk-score-fill';
    if (riskScore >= 70) {
        riskScoreBar.classList.add('high');
    } else if (riskScore <= 30) {
        riskScoreBar.classList.add('low');
    }
    
    // Interventions
    interventionsList.innerHTML = '';
    if (data.interventions && Array.isArray(data.interventions)) {
        data.interventions.forEach(intervention => {
            const li = document.createElement('li');
            li.textContent = intervention;
            interventionsList.appendChild(li);
        });
    }
}

// Display error function
function displayError(message) {
    problemSummary.textContent = message;
    possibleCauses.innerHTML = '';
    riskScoreValue.textContent = '0';
    riskScoreBar.style.width = '0%';
    interventionsList.innerHTML = '';
    
    resultsSection.classList.remove('hidden');
}

// Event listener for analyze button
if (analyzeBtn) {
    analyzeBtn.addEventListener('click', analyzeScenario);
}

// Load last analysis if available
document.addEventListener('DOMContentLoaded', () => {
    const lastAnalysis = window.RoadSphere.loadFromLocalStorage('lastAnalysis');
    if (lastAnalysis && window.location.pathname.includes('index.html')) {
        displayResults(lastAnalysis);
        resultsSection.classList.remove('hidden');
    }
});