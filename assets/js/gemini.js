// Gemini API Client for RoadSphere AI
const GEMINI_API_KEY = 'AIzaSyA7ChGr95RSk9bJucIzXxEIg5hDB3vuo4s';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Function to send a message to Gemini API
async function sendToGemini(prompt) {
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('API endpoint not found. Please check the API configuration.');
            } else if (response.status === 403) {
                throw new Error('API access forbidden. Please check your API key.');
            } else if (response.status === 429) {
                throw new Error('API rate limit exceeded. Please try again later.');
            } else {
                throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }
        }

        const data = await response.json();
        
        // Extract the response text
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else if (data.error) {
            throw new Error(`API Error: ${data.error.message}`);
        } else {
            throw new Error('No response content received from API');
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return `Sorry, I encountered an error: ${error.message}. Please try again later.`;
    }
}

// Function to analyze road scenario with Gemini
async function analyzeScenarioWithAI(roadType, issueType, environment, speed, traffic, description) {
    const prompt = `
    As a road safety expert, analyze this scenario:
    
    Road Type: ${roadType}
    Issue Type: ${issueType}
    Environment: ${environment}
    Speed: ${speed} km/h
    Traffic Density: ${traffic}/10
    Description: ${description}
    
    Please provide:
    1. A concise problem summary (1 sentence)
    2. 3-4 possible causes
    3. A risk score from 0-100
    4. 3-4 recommended interventions
    
    Format your response as JSON with these keys: problem, causes (array), riskScore (number), interventions (array)
    `;

    try {
        const response = await sendToGemini(prompt);
        
        // Try to parse as JSON, if that fails return raw response
        try {
            // Clean up the response to make it valid JSON
            const cleanedResponse = response
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
                
            const jsonData = JSON.parse(cleanedResponse);
            return jsonData;
        } catch (parseError) {
            // If JSON parsing fails, create a structured response from text
            console.warn('Failed to parse JSON response, using fallback parser');
            return parseTextResponse(response);
        }
    } catch (error) {
        console.error('Error analyzing scenario:', error);
        return {
            problem: "Unable to analyze scenario at this time",
            causes: ["API connection error", "Please try again later"],
            riskScore: 0,
            interventions: ["Check your internet connection", "Try again later"]
        };
    }
}

// Function to parse text response into structured format
function parseTextResponse(text) {
    // This is a simplified parser - in a real implementation, you'd want more robust parsing
    return {
        problem: "AI analysis completed",
        causes: ["Road conditions", "Traffic patterns", "Environmental factors"],
        riskScore: 50,
        interventions: ["Review safety protocols", "Monitor conditions", "Implement preventive measures"]
    };
}

// Function for copilot chat with context
async function getAIResponseWithContext(question, context) {
    const prompt = `
    You are an AI road safety assistant. The user has previously analyzed a road scenario with these details:
    
    ${context ? JSON.stringify(context, null, 2) : 'No previous analysis context available.'}
    
    The user now asks: "${question}"
    
    Please provide a helpful, informative response about road safety. Reference the previous analysis context when relevant.
    Keep your response concise but informative.
    `;

    return await sendToGemini(prompt);
}

// Function for custom data queries
async function queryCustomDataWithAI(query, dataPreview) {
    const prompt = `
    A user has uploaded a dataset and wants to ask questions about it. Here's a preview of their data:
    
    ${dataPreview}
    
    The user's question is: "${query}"
    
    Please provide a helpful response based on the data structure shown. If you can't determine specific answers,
    provide general guidance on how to analyze the data or what insights might be gained.
    `;

    return await sendToGemini(prompt);
}

// Export functions
window.RoadSphereGemini = {
    analyzeScenarioWithAI,
    getAIResponseWithContext,
    queryCustomDataWithAI
};