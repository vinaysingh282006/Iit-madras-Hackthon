// AI Safety Copilot Module for RoadSphere AI

// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const analysisContext = document.getElementById('analysisContext');

// Initialize copilot
document.addEventListener('DOMContentLoaded', () => {
    // Load last analysis context
    loadAnalysisContext();
    
    // Set up event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});

// Load analysis context from localStorage
function loadAnalysisContext() {
    const lastAnalysis = window.RoadSphere.loadFromLocalStorage('lastAnalysis');
    
    if (lastAnalysis) {
        analysisContext.innerHTML = `
            <h4>${lastAnalysis.problem || 'Previous Analysis'}</h4>
            <p><strong>Risk Score:</strong> ${(lastAnalysis.riskScore || 0)}/100</p>
            <h5>Recommended Interventions:</h5>
            <ul>
                ${Array.isArray(lastAnalysis.interventions) ? 
                  lastAnalysis.interventions.map(i => `<li>${i}</li>`).join('') : 
                  '<li>No interventions available</li>'}
            </ul>
        `;
    }
}

// Send message function
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (message) {
        // Add user message to chat
        addMessage(message, 'user');
        
        // Clear input
        userInput.value = '';
        
        // Disable send button while processing
        sendButton.disabled = true;
        sendButton.textContent = 'Sending...';
        
        try {
            // Load Gemini module if not already loaded
            await loadGeminiModule();
            
            // Get context
            const context = window.RoadSphere.loadFromLocalStorage('lastAnalysis');
            
            // Get AI response
            const response = await window.RoadSphereGemini.getAIResponseWithContext(message, context);
            
            // Add AI response to chat
            addMessage(response, 'ai');
        } catch (error) {
            console.error('Error getting AI response:', error);
            addMessage("Sorry, I'm having trouble connecting to the AI service. Please try again.", 'ai');
        } finally {
            // Re-enable send button
            sendButton.disabled = false;
            sendButton.textContent = 'Send';
        }
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

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    messageDiv.textContent = text;
    
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}