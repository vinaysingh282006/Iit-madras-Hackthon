// Custom Data Module for RoadSphere AI

// DOM Elements
const csvFile = document.getElementById('csvFile');
const uploadBtn = document.getElementById('uploadBtn');
const previewSection = document.getElementById('previewSection');
const tableContainer = document.getElementById('tableContainer');
const buildKnowledgeBtn = document.getElementById('buildKnowledgeBtn');
const queryInput = document.getElementById('queryInput');
const queryBtn = document.getElementById('queryBtn');
const responseArea = document.getElementById('responseArea');

// Global variables
let csvData = [];
let knowledgeBase = [];

// Initialize module
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    uploadBtn.addEventListener('click', handleFileUpload);
    buildKnowledgeBtn.addEventListener('click', buildKnowledge);
    queryBtn.addEventListener('click', handleQuery);
});

// Handle file upload
function handleFileUpload() {
    const file = csvFile.files[0];
    
    if (!file) {
        alert('Please select a CSV file first.');
        return;
    }
    
    if (!file.name.endsWith('.csv')) {
        alert('Please select a valid CSV file.');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        parseCSV(content);
    };
    
    reader.onerror = function() {
        alert('Error reading file. Please try again.');
    };
    
    reader.readAsText(file);
}

// Parse CSV content
function parseCSV(content) {
    // Split content into lines
    const lines = content.split('\n');
    
    if (lines.length < 2) {
        alert('CSV file must contain at least a header row and one data row.');
        return;
    }
    
    // Get headers from first line
    const headers = lines[0].split(',').map(header => header.trim().replace(/['"]+/g, ''));
    
    // Parse data rows
    csvData = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const values = line.split(',').map(value => value.trim().replace(/['"]+/g, ''));
            if (values.length === headers.length) {
                const row = {};
                for (let j = 0; j < headers.length; j++) {
                    row[headers[j]] = values[j];
                }
                csvData.push(row);
            }
        }
    }
    
    if (csvData.length === 0) {
        alert('No valid data found in CSV file.');
        return;
    }
    
    // Display preview
    displayPreview(headers, csvData);
    
    // Show preview section
    previewSection.classList.remove('hidden');
}

// Display data preview
function displayPreview(headers, data) {
    // Create table
    const table = document.createElement('table');
    table.className = 'preview-table';
    
    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body with first 5 rows
    const tbody = document.createElement('tbody');
    const rowsToShow = Math.min(5, data.length);
    for (let i = 0; i < rowsToShow; i++) {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = data[i][header] || '';
            row.appendChild(td);
        });
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    
    // Add info about total rows
    if (data.length > 5) {
        const infoRow = document.createElement('p');
        infoRow.textContent = `Showing first 5 of ${data.length} rows.`;
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
        tableContainer.appendChild(infoRow);
    } else {
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
    }
}

// Build knowledge base from CSV data
function buildKnowledge() {
    if (csvData.length === 0) {
        alert('No data available. Please upload a CSV file first.');
        return;
    }
    
    // Create simple knowledge base
    knowledgeBase = [];
    
    // For each row, create knowledge entries
    csvData.forEach((row, index) => {
        // Create a text representation of the row
        let rowText = `Record ${index + 1}: `;
        Object.keys(row).forEach(key => {
            rowText += `${key} is ${row[key]}, `;
        });
        rowText = rowText.slice(0, -2); // Remove trailing comma and space
        
        // Create simple embedding (just store the text)
        knowledgeBase.push({
            id: index,
            content: rowText,
            data: row
        });
    });
    
    // Save to localStorage
    window.RoadSphere.saveToLocalStorage('customKnowledgeBase', knowledgeBase);
    
    alert(`Knowledge base built with ${knowledgeBase.length} records. You can now query your data.`);
}

// Handle query
async function handleQuery() {
    const query = queryInput.value.trim();
    
    if (!query) {
        alert('Please enter a query.');
        return;
    }
    
    // Show processing state
    queryBtn.disabled = true;
    queryBtn.textContent = 'Processing...';
    responseArea.innerHTML = '<p>Analyzing your data with AI...</p>';
    
    try {
        // Load knowledge base
        const storedKnowledge = window.RoadSphere.loadFromLocalStorage('customKnowledgeBase');
        if (!storedKnowledge || storedKnowledge.length === 0) {
            responseArea.innerHTML = '<p>Please upload data and build knowledge base first.</p>';
            return;
        }
        
        knowledgeBase = storedKnowledge;
        
        // Load Gemini module
        await loadGeminiModule();
        
        // Create a preview of the data for the AI
        let dataPreview = "CSV Headers: ";
        if (csvData.length > 0) {
            const headers = Object.keys(csvData[0]);
            dataPreview += headers.join(", ");
            
            dataPreview += "\n\nSample Data:\n";
            const sampleRows = Math.min(3, csvData.length);
            for (let i = 0; i < sampleRows; i++) {
                dataPreview += JSON.stringify(csvData[i]) + "\n";
            }
        }
        
        // Get AI response
        const response = await window.RoadSphereGemini.queryCustomDataWithAI(query, dataPreview);
        
        // Display results
        responseArea.innerHTML = `<h4>AI Analysis:</h4><p>${response}</p>`;
    } catch (error) {
        console.error('Error processing query:', error);
        responseArea.innerHTML = `<p>Error: ${error.message}</p><p>Please try again.</p>`;
    } finally {
        // Reset button
        queryBtn.disabled = false;
        queryBtn.textContent = 'Query';
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