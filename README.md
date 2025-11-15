# RoadSphere AI - Road Safety Intervention Studio

RoadSphere AI is a complete web application for analyzing road safety problems using AI concepts, viewing visual simulations, exploring accident insights, and uploading custom data for analysis.

## Features

1. **Scenario & Results** - Analyze road scenarios with structured inputs and AI-powered results
2. **AI Safety Copilot** - Chat-style interface for road safety questions
3. **Simulation** - Visual road scenario simulator with safety interventions
4. **Accident Insights** - Data-driven analysis of common crash causes
5. **Custom Data** - Upload and analyze your own accident data

## Project Structure

```
/
├── index.html                 # Scenario & Results page
├── copilot.html              # AI Safety Copilot page
├── simulation.html           # Road simulation page
├── insights.html             # Accident insights page
├── custom-data.html          # Custom data analysis page
├── assets/
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   └── js/
│       ├── main.js           # Main JavaScript utilities
│       ├── scenario.js       # Scenario analysis logic
│       ├── copilot.js        # AI copilot functionality
│       ├── simulation.js     # Road simulation engine
│       ├── insights.js       # Accident insights display
│       └── custom-data.js    # Custom data processing
└── data/
    ├── GPT_DATASET.csv       # Sample road safety dataset
    └── ACCIDENT_CAUSES.csv   # Sample accident causes data
```

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Navigate between pages using the top navigation bar

## Technology Stack

- **HTML5** - Semantic markup and structure
- **CSS3** - Responsive design and styling
- **JavaScript (ES6)** - Client-side functionality
- **SVG** - Vector graphics for simulation
- **LocalStorage** - Client-side data persistence

## Pages

### 1. Scenario & Results (index.html)
Allows users to describe road scenarios and receive structured safety analysis including:
- Problem summary
- Possible causes
- Risk score (0-100)
- Recommended interventions

### 2. AI Safety Copilot (copilot.html)
Chat-style interface for asking road safety questions with:
- Context panel showing last analyzed scenario
- Interactive chat messages
- Dataset-based response simulation

### 3. Simulation (simulation.html)
Visual road scenario simulator with:
- Multiple scene types (Straight, Curve, T-Intersection, School Zone)
- Toggleable safety interventions
- AI package application button

### 4. Accident Insights (insights.html)
Data-driven analysis with:
- Filterable insights by road and issue type
- Common causes and prevention strategies
- Statistical visualizations

### 5. Custom Data (custom-data.html)
Custom data analysis features:
- CSV file upload
- Data preview
- Knowledge base building
- Query interface

## Data Processing

All processing is done client-side using:
- LocalStorage for data persistence
- Simple text matching for retrieval
- JavaScript-based visualization
- No external dependencies or backend required

## Browser Support

Works in all modern browsers that support:
- ES6 JavaScript
- LocalStorage API
- SVG graphics
- CSS3 features

## License

This project is open source and available under the MIT License.