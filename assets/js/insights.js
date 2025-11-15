// Accident Insights Module for RoadSphere AI

// DOM Elements
const roadTypeFilter = document.getElementById('roadTypeFilter');
const issueTypeFilter = document.getElementById('issueTypeFilter');
const insightsGrid = document.getElementById('insightsGrid');

// Sample accident insights data
const ACCIDENT_INSIGHTS = [
    {
        id: 1,
        title: "Common Causes on Highways",
        roadType: "highway",
        issueType: "collision",
        causes: [
            "Distracted driving (texting, eating)",
            "Speeding and aggressive driving",
            "Fatigue and drowsy driving",
            "Tailgating and following too closely"
        ],
        prevention: [
            "Use hands-free devices only",
            "Maintain safe following distances",
            "Take regular rest stops",
            "Obey posted speed limits"
        ],
        statistics: {
            "Distracted Driving": 25,
            "Speeding": 30,
            "Fatigue": 15,
            "Tailgating": 20
        }
    },
    {
        id: 2,
        title: "Pedestrian-related Crashes",
        roadType: "residential",
        issueType: "collision",
        causes: [
            "Failure to yield to pedestrians",
            "Poor visibility at night",
            "Distracted walking (headphones, phones)",
            "Jaywalking and illegal crossings"
        ],
        prevention: [
            "Install better street lighting",
            "Add pedestrian crossing signals",
            "Educate drivers and pedestrians",
            "Create designated crossing points"
        ],
        statistics: {
            "Failure to Yield": 35,
            "Poor Visibility": 25,
            "Distracted Walking": 20,
            "Jaywalking": 20
        }
    },
    {
        id: 3,
        title: "Visibility and Curve Issues",
        roadType: "rural",
        issueType: "hazard",
        causes: [
            "Sharp curves with inadequate sight distance",
            "Fog and weather-related visibility issues",
            "Lack of reflective road markers",
            "Absence of curve warning signs"
        ],
        prevention: [
            "Install reflective road markers",
            "Add advanced curve warning signs",
            "Improve roadside clearing",
            "Implement fog detection systems"
        ],
        statistics: {
            "Sharp Curves": 30,
            "Weather Visibility": 25,
            "Missing Markers": 20,
            "Warning Signs": 25
        }
    },
    {
        id: 4,
        title: "Intersection Accidents",
        roadType: "arterial",
        issueType: "collision",
        causes: [
            "Running red lights and stop signs",
            "Improper turns (left turns especially)",
            "Inadequate signal timing",
            "Blocked sight lines"
        ],
        prevention: [
            "Install red-light cameras",
            "Optimize signal timing",
            "Clear vegetation blocking views",
            "Add turn lanes and protected signals"
        ],
        statistics: {
            "Running Lights": 30,
            "Improper Turns": 25,
            "Signal Timing": 20,
            "Blocked Views": 25
        }
    },
    {
        id: 5,
        title: "Weather-related Incidents",
        roadType: "all",
        issueType: "nearMiss",
        causes: [
            "Driving too fast for conditions",
            "Inadequate tire maintenance",
            "Failure to use headlights",
            "Following too closely in rain"
        ],
        prevention: [
            "Reduce speed in adverse weather",
            "Check tire condition regularly",
            "Use headlights appropriately",
            "Increase following distances"
        ],
        statistics: {
            "Speeding": 35,
            "Tire Issues": 20,
            "Headlights": 15,
            "Following Too Closely": 30
        }
    },
    {
        id: 6,
        title: "Infrastructure Deficiencies",
        roadType: "all",
        issueType: "infrastructure",
        causes: [
            "Potholes and road surface damage",
            "Inadequate drainage systems",
            "Worn-out road markings",
            "Malfunctioning traffic signals"
        ],
        prevention: [
            "Regular road maintenance schedules",
            "Improve drainage infrastructure",
            "Refresh road markings frequently",
            "Maintain traffic signal systems"
        ],
        statistics: {
            "Road Surface": 30,
            "Drainage": 25,
            "Road Markings": 20,
            "Traffic Signals": 25
        }
    }
];

// Initialize insights
document.addEventListener('DOMContentLoaded', () => {
    // Render all insights initially
    renderInsights(ACCIDENT_INSIGHTS);
    
    // Set up filter event listeners
    roadTypeFilter.addEventListener('change', filterInsights);
    issueTypeFilter.addEventListener('change', filterInsights);
});

// Filter insights based on selections
function filterInsights() {
    const roadType = roadTypeFilter.value;
    const issueType = issueTypeFilter.value;
    
    let filteredInsights = ACCIDENT_INSIGHTS;
    
    if (roadType !== 'all') {
        filteredInsights = filteredInsights.filter(insight => 
            insight.roadType === roadType || insight.roadType === 'all'
        );
    }
    
    if (issueType !== 'all') {
        filteredInsights = filteredInsights.filter(insight => 
            insight.issueType === issueType || insight.issueType === 'all'
        );
    }
    
    renderInsights(filteredInsights);
}

// Render insights cards
function renderInsights(insights) {
    insightsGrid.innerHTML = '';
    
    insights.forEach(insight => {
        const card = document.createElement('div');
        card.className = 'insight-card';
        
        // Create causes list
        const causesList = insight.causes.map(cause => `<li>${cause}</li>`).join('');
        
        // Create prevention list
        const preventionList = insight.prevention.map(item => `<li>${item}</li>`).join('');
        
        // Create chart
        let chartHTML = '<div class="chart-container"><div class="bar-chart">';
        for (const [key, value] of Object.entries(insight.statistics)) {
            chartHTML += `
                <div class="bar" style="height: ${value * 3}px;">
                    <div class="bar-value">${value}%</div>
                    <div class="bar-label">${key}</div>
                </div>
            `;
        }
        chartHTML += '</div></div>';
        
        card.innerHTML = `
            <h3>${insight.title}</h3>
            <h4>Common Causes</h4>
            <ul>${causesList}</ul>
            <h4>Prevention Strategies</h4>
            <ul>${preventionList}</ul>
            <h4>Statistics</h4>
            ${chartHTML}
        `;
        
        insightsGrid.appendChild(card);
    });
}