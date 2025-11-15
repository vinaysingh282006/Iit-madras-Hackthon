// Simulation Module for RoadSphere AI

// DOM Elements
const sceneType = document.getElementById('sceneType');
const rumbleStrips = document.getElementById('rumbleStrips');
const guardrail = document.getElementById('guardrail');
const signage = document.getElementById('signage');
const zebraCrossing = document.getElementById('zebraCrossing');
const lighting = document.getElementById('lighting');
const applyAiPackage = document.getElementById('applyAiPackage');
const roadVisualization = document.getElementById('roadVisualization');

// Animation variables
let animationId = null;
let vehicles = [];
let pedestrians = [];
let weatherEffect = null;
let isAnimating = false;

// Initialize simulation
document.addEventListener('DOMContentLoaded', () => {
    // Draw initial scene
    drawScene();
    
    // Set up event listeners
    sceneType.addEventListener('change', drawScene);
    rumbleStrips.addEventListener('change', drawScene);
    guardrail.addEventListener('change', drawScene);
    signage.addEventListener('change', drawScene);
    zebraCrossing.addEventListener('change', drawScene);
    lighting.addEventListener('change', drawScene);
    applyAiPackage.addEventListener('click', applyAIPackage);
    
    // Add animation control buttons
    createAnimationControls();
});

// Create animation controls
function createAnimationControls() {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'animation-controls';
    controlsDiv.innerHTML = `
        <button id="startAnimation" class="btn-secondary">Start Animation</button>
        <button id="stopAnimation" class="btn-secondary" disabled>Stop Animation</button>
        <button id="addVehicle" class="btn-secondary">Add Vehicle</button>
        <button id="addPedestrian" class="btn-secondary">Add Pedestrian</button>
        <select id="weatherEffect">
            <option value="none">No Weather</option>
            <option value="rain">Rain</option>
            <option value="fog">Fog</option>
            <option value="snow">Snow</option>
        </select>
    `;
    
    // Insert before the visualization container
    document.querySelector('.simulation-container').insertBefore(controlsDiv, roadVisualization.parentNode);
    
    // Add event listeners for new controls
    document.getElementById('startAnimation').addEventListener('click', startAnimation);
    document.getElementById('stopAnimation').addEventListener('click', stopAnimation);
    document.getElementById('addVehicle').addEventListener('click', addVehicle);
    document.getElementById('addPedestrian').addEventListener('click', addPedestrian);
    document.getElementById('weatherEffect').addEventListener('change', changeWeather);
}

// Draw scene based on selections
function drawScene() {
    // Clear previous visualization
    roadVisualization.innerHTML = '';
    
    // Get current settings
    const scene = sceneType.value;
    const showRumbleStrips = rumbleStrips.checked;
    const showGuardrail = guardrail.checked;
    const showSignage = signage.checked;
    const showZebra = zebraCrossing.checked;
    const showLighting = lighting.checked;
    
    // Create SVG container
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 800 400");
    svg.setAttribute("id", "simulationCanvas");
    
    // Draw sky
    const sky = document.createElementNS(svgNS, "rect");
    sky.setAttribute("x", "0");
    sky.setAttribute("y", "0");
    sky.setAttribute("width", "800");
    sky.setAttribute("height", "200");
    sky.setAttribute("fill", "#87CEEB");
    svg.appendChild(sky);
    
    // Draw ground
    const ground = document.createElementNS(svgNS, "rect");
    ground.setAttribute("x", "0");
    ground.setAttribute("y", "200");
    ground.setAttribute("width", "800");
    ground.setAttribute("height", "200");
    ground.setAttribute("fill", "#228B22");
    svg.appendChild(ground);
    
    // Draw different scenes
    switch(scene) {
        case 'straight':
            drawStraightRoad(svg, showRumbleStrips, showGuardrail, showSignage, showZebra, showLighting);
            break;
        case 'curve':
            drawCurvedRoad(svg, showRumbleStrips, showGuardrail, showSignage, showZebra, showLighting);
            break;
        case 't-intersection':
            drawTIntersection(svg, showRumbleStrips, showGuardrail, showSignage, showZebra, showLighting);
            break;
        case 'school-zone':
            drawSchoolZone(svg, showRumbleStrips, showGuardrail, showSignage, showZebra, showLighting);
            break;
    }
    
    // Add weather effects if any
    if (weatherEffect) {
        drawWeatherEffect(svg, weatherEffect);
    }
    
    // Add vehicles if any
    vehicles.forEach(vehicle => {
        drawVehicle(svg, vehicle);
    });
    
    // Add pedestrians if any
    pedestrians.forEach(pedestrian => {
        drawPedestrian(svg, pedestrian);
    });
    
    // Add SVG to container
    roadVisualization.appendChild(svg);
}

// Draw straight road
function drawStraightRoad(svg, showRumbleStrips, showGuardrail, showSignage, showZebra, showLighting) {
    const svgNS = "http://www.w3.org/2000/svg";
    
    // Draw road
    const road = document.createElementNS(svgNS, "rect");
    road.setAttribute("x", "100");
    road.setAttribute("y", "150");
    road.setAttribute("width", "600");
    road.setAttribute("height", "100");
    road.setAttribute("fill", "#555");
    svg.appendChild(road);
    
    // Draw road markings
    for (let i = 0; i < 5; i++) {
        const marking = document.createElementNS(svgNS, "rect");
        marking.setAttribute("x", 150 + i * 150);
        marking.setAttribute("y", "195");
        marking.setAttribute("width", "50");
        marking.setAttribute("height", "10");
        marking.setAttribute("fill", "#fff");
        svg.appendChild(marking);
    }
    
    // Draw rumble strips if enabled
    if (showRumbleStrips) {
        for (let i = 0; i < 3; i++) {
            const strip = document.createElementNS(svgNS, "rect");
            strip.setAttribute("x", 120 + i * 200);
            strip.setAttribute("y", "155");
            strip.setAttribute("width", "20");
            strip.setAttribute("height", "5");
            strip.setAttribute("fill", "#ff0");
            svg.appendChild(strip);
            
            const strip2 = document.createElementNS(svgNS, "rect");
            strip2.setAttribute("x", 120 + i * 200);
            strip2.setAttribute("y", "240");
            strip2.setAttribute("width", "20");
            strip2.setAttribute("height", "5");
            strip2.setAttribute("fill", "#ff0");
            svg.appendChild(strip2);
        }
    }
    
    // Draw guardrails if enabled
    if (showGuardrail) {
        // Left guardrail
        for (let i = 0; i < 8; i++) {
            const rail = document.createElementNS(svgNS, "rect");
            rail.setAttribute("x", "95");
            rail.setAttribute("y", 160 + i * 25);
            rail.setAttribute("width", "5");
            rail.setAttribute("height", "15");
            rail.setAttribute("fill", "#ccc");
            svg.appendChild(rail);
        }
        
        // Right guardrail
        for (let i = 0; i < 8; i++) {
            const rail = document.createElementNS(svgNS, "rect");
            rail.setAttribute("x", "700");
            rail.setAttribute("y", 160 + i * 25);
            rail.setAttribute("width", "5");
            rail.setAttribute("height", "15");
            rail.setAttribute("fill", "#ccc");
            svg.appendChild(rail);
        }
    }
    
    // Draw signage if enabled
    if (showSignage) {
        const sign = document.createElementNS(svgNS, "rect");
        sign.setAttribute("x", "650");
        sign.setAttribute("y", "100");
        sign.setAttribute("width", "40");
        sign.setAttribute("height", "40");
        sign.setAttribute("fill", "#f00");
        sign.setAttribute("rx", "5");
        svg.appendChild(sign);
        
        const signText = document.createElementNS(svgNS, "text");
        signText.setAttribute("x", "670");
        signText.setAttribute("y", "125");
        signText.setAttribute("font-family", "Arial");
        signText.setAttribute("font-size", "20");
        signText.setAttribute("text-anchor", "middle");
        signText.setAttribute("fill", "#fff");
        signText.textContent = "!";
        svg.appendChild(signText);
    }
    
    // Draw zebra crossing if enabled
    if (showZebra) {
        for (let i = 0; i < 5; i++) {
            const stripe = document.createElementNS(svgNS, "rect");
            stripe.setAttribute("x", "380");
            stripe.setAttribute("y", 150 + i * 20);
            stripe.setAttribute("width", "40");
            stripe.setAttribute("height", "10");
            stripe.setAttribute("fill", "#fff");
            svg.appendChild(stripe);
        }
    }
    
    // Draw lighting if enabled
    if (showLighting) {
        const light = document.createElementNS(svgNS, "circle");
        light.setAttribute("cx", "200");
        light.setAttribute("cy", "100");
        light.setAttribute("r", "15");
        light.setAttribute("fill", "#ff0");
        svg.appendChild(light);
        
        const pole = document.createElementNS(svgNS, "rect");
        pole.setAttribute("x", "195");
        pole.setAttribute("y", "100");
        pole.setAttribute("width", "10");
        pole.setAttribute("height", "50");
        pole.setAttribute("fill", "#888");
        svg.appendChild(pole);
    }
}

// Draw curved road
function drawCurvedRoad(svg, showRumbleStrips, showGuardrail, showSignage, showZebra, showLighting) {
    const svgNS = "http://www.w3.org/2000/svg";
    
    // Draw curved road using path
    const roadPath = document.createElementNS(svgNS, "path");
    roadPath.setAttribute("d", "M 100 300 Q 400 100 700 300");
    roadPath.setAttribute("stroke", "#555");
    roadPath.setAttribute("stroke-width", "100");
    roadPath.setAttribute("fill", "none");
    svg.appendChild(roadPath);
    
    // Draw center line
    const centerLine = document.createElementNS(svgNS, "path");
    centerLine.setAttribute("d", "M 100 300 Q 400 100 700 300");
    centerLine.setAttribute("stroke", "#fff");
    centerLine.setAttribute("stroke-width", "5");
    centerLine.setAttribute("stroke-dasharray", "20,20");
    centerLine.setAttribute("fill", "none");
    svg.appendChild(centerLine);
    
    // Draw guardrails if enabled
    if (showGuardrail) {
        const leftRail = document.createElementNS(svgNS, "path");
        leftRail.setAttribute("d", "M 50 300 Q 350 50 650 300");
        leftRail.setAttribute("stroke", "#ccc");
        leftRail.setAttribute("stroke-width", "10");
        leftRail.setAttribute("fill", "none");
        svg.appendChild(leftRail);
        
        const rightRail = document.createElementNS(svgNS, "path");
        rightRail.setAttribute("d", "M 150 300 Q 450 150 750 300");
        rightRail.setAttribute("stroke", "#ccc");
        rightRail.setAttribute("stroke-width", "10");
        rightRail.setAttribute("fill", "none");
        svg.appendChild(rightRail);
    }
    
    // Draw signage if enabled
    if (showSignage) {
        const sign = document.createElementNS(svgNS, "rect");
        sign.setAttribute("x", "600");
        sign.setAttribute("y", "150");
        sign.setAttribute("width", "40");
        sign.setAttribute("height", "40");
        sign.setAttribute("fill", "#f00");
        sign.setAttribute("rx", "5");
        svg.appendChild(sign);
        
        const signText = document.createElementNS(svgNS, "text");
        signText.setAttribute("x", "620");
        signText.setAttribute("y", "175");
        signText.setAttribute("font-family", "Arial");
        signText.setAttribute("font-size", "20");
        signText.setAttribute("text-anchor", "middle");
        signText.setAttribute("fill", "#fff");
        signText.textContent = "!";
        svg.appendChild(signText);
    }
    
    // Draw lighting if enabled
    if (showLighting) {
        const light = document.createElementNS(svgNS, "circle");
        light.setAttribute("cx", "300");
        light.setAttribute("cy", "150");
        light.setAttribute("r", "15");
        light.setAttribute("fill", "#ff0");
        svg.appendChild(light);
        
        const pole = document.createElementNS(svgNS, "rect");
        pole.setAttribute("x", "295");
        pole.setAttribute("y", "150");
        pole.setAttribute("width", "10");
        pole.setAttribute("height", "50");
        pole.setAttribute("fill", "#888");
        svg.appendChild(pole);
    }
}

// Draw T-intersection
function drawTIntersection(svg, showRumbleStrips, showGuardrail, showSignage, showZebra, showLighting) {
    const svgNS = "http://www.w3.org/2000/svg";
    
    // Draw horizontal road
    const hRoad = document.createElementNS(svgNS, "rect");
    hRoad.setAttribute("x", "100");
    hRoad.setAttribute("y", "180");
    hRoad.setAttribute("width", "600");
    hRoad.setAttribute("height", "40");
    hRoad.setAttribute("fill", "#555");
    svg.appendChild(hRoad);
    
    // Draw vertical road
    const vRoad = document.createElementNS(svgNS, "rect");
    vRoad.setAttribute("x", "380");
    vRoad.setAttribute("y", "100");
    vRoad.setAttribute("width", "40");
    vRoad.setAttribute("height", "200");
    vRoad.setAttribute("fill", "#555");
    svg.appendChild(vRoad);
    
    // Draw road markings
    // Horizontal
    for (let i = 0; i < 3; i++) {
        const marking = document.createElementNS(svgNS, "rect");
        marking.setAttribute("x", 150 + i * 200);
        marking.setAttribute("y", "195");
        marking.setAttribute("width", "50");
        marking.setAttribute("height", "10");
        marking.setAttribute("fill", "#fff");
        svg.appendChild(marking);
    }
    
    // Vertical
    for (let i = 0; i < 2; i++) {
        const marking = document.createElementNS(svgNS, "rect");
        marking.setAttribute("x", "395");
        marking.setAttribute("y", 120 + i * 80);
        marking.setAttribute("width", "10");
        marking.setAttribute("height", "40");
        marking.setAttribute("fill", "#fff");
        svg.appendChild(marking);
    }
    
    // Draw guardrails if enabled
    if (showGuardrail) {
        // Horizontal guardrails
        const hGuard1 = document.createElementNS(svgNS, "rect");
        hGuard1.setAttribute("x", "100");
        hGuard1.setAttribute("y", "170");
        hGuard1.setAttribute("width", "600");
        hGuard1.setAttribute("height", "5");
        hGuard1.setAttribute("fill", "#ccc");
        svg.appendChild(hGuard1);
        
        const hGuard2 = document.createElementNS(svgNS, "rect");
        hGuard2.setAttribute("x", "100");
        hGuard2.setAttribute("y", "225");
        hGuard2.setAttribute("width", "600");
        hGuard2.setAttribute("height", "5");
        hGuard2.setAttribute("fill", "#ccc");
        svg.appendChild(hGuard2);
        
        // Vertical guardrails
        const vGuard1 = document.createElementNS(svgNS, "rect");
        vGuard1.setAttribute("x", "370");
        vGuard1.setAttribute("y", "100");
        vGuard1.setAttribute("width", "5");
        vGuard1.setAttribute("height", "200");
        vGuard1.setAttribute("fill", "#ccc");
        svg.appendChild(vGuard1);
        
        const vGuard2 = document.createElementNS(svgNS, "rect");
        vGuard2.setAttribute("x", "425");
        vGuard2.setAttribute("y", "100");
        vGuard2.setAttribute("width", "5");
        vGuard2.setAttribute("height", "200");
        vGuard2.setAttribute("fill", "#ccc");
        svg.appendChild(vGuard2);
    }
    
    // Draw signage if enabled
    if (showSignage) {
        const sign = document.createElementNS(svgNS, "rect");
        sign.setAttribute("x", "350");
        sign.setAttribute("y", "80");
        sign.setAttribute("width", "40");
        sign.setAttribute("height", "40");
        sign.setAttribute("fill", "#f00");
        sign.setAttribute("rx", "5");
        svg.appendChild(sign);
        
        const signText = document.createElementNS(svgNS, "text");
        signText.setAttribute("x", "370");
        signText.setAttribute("y", "105");
        signText.setAttribute("font-family", "Arial");
        signText.setAttribute("font-size", "16");
        signText.setAttribute("text-anchor", "middle");
        signText.setAttribute("fill", "#fff");
        signText.textContent = "STOP";
        svg.appendChild(signText);
    }
    
    // Draw lighting if enabled
    if (showLighting) {
        const light = document.createElementNS(svgNS, "circle");
        light.setAttribute("cx", "250");
        light.setAttribute("cy", "150");
        light.setAttribute("r", "15");
        light.setAttribute("fill", "#ff0");
        svg.appendChild(light);
        
        const pole = document.createElementNS(svgNS, "rect");
        pole.setAttribute("x", "245");
        pole.setAttribute("y", "150");
        pole.setAttribute("width", "10");
        pole.setAttribute("height", "50");
        pole.setAttribute("fill", "#888");
        svg.appendChild(pole);
    }
}

// Draw school zone
function drawSchoolZone(svg, showRumbleStrips, showGuardrail, showSignage, showZebra, showLighting) {
    const svgNS = "http://www.w3.org/2000/svg";
    
    // Draw road
    const road = document.createElementNS(svgNS, "rect");
    road.setAttribute("x", "100");
    road.setAttribute("y", "180");
    road.setAttribute("width", "600");
    road.setAttribute("height", "40");
    road.setAttribute("fill", "#555");
    svg.appendChild(road);
    
    // Draw road markings
    for (let i = 0; i < 5; i++) {
        const marking = document.createElementNS(svgNS, "rect");
        marking.setAttribute("x", 130 + i * 120);
        marking.setAttribute("y", "195");
        marking.setAttribute("width", "40");
        marking.setAttribute("height", "10");
        marking.setAttribute("fill", "#fff");
        svg.appendChild(marking);
    }
    
    // Draw zebra crossing
    for (let i = 0; i < 5; i++) {
        const stripe = document.createElementNS(svgNS, "rect");
        stripe.setAttribute("x", "380");
        stripe.setAttribute("y", 180 + i * 8);
        stripe.setAttribute("width", "40");
        stripe.setAttribute("height", "4");
        stripe.setAttribute("fill", "#fff");
        svg.appendChild(stripe);
    }
    
    // Draw school building
    const school = document.createElementNS(svgNS, "rect");
    school.setAttribute("x", "500");
    school.setAttribute("y", "100");
    school.setAttribute("width", "150");
    school.setAttribute("height", "70");
    school.setAttribute("fill", "#8B4513");
    svg.appendChild(school);
    
    const roof = document.createElementNS(svgNS, "polygon");
    roof.setAttribute("points", "500,100 575,70 650,100");
    roof.setAttribute("fill", "#A52A2A");
    svg.appendChild(roof);
    
    // Draw signage if enabled
    if (showSignage) {
        const sign = document.createElementNS(svgNS, "rect");
        sign.setAttribute("x", "350");
        sign.setAttribute("y", "120");
        sign.setAttribute("width", "60");
        sign.setAttribute("height", "40");
        sign.setAttribute("fill", "#f00");
        sign.setAttribute("rx", "5");
        svg.appendChild(sign);
        
        const signText = document.createElementNS(svgNS, "text");
        signText.setAttribute("x", "380");
        signText.setAttribute("y", "145");
        signText.setAttribute("font-family", "Arial");
        signText.setAttribute("font-size", "16");
        signText.setAttribute("text-anchor", "middle");
        signText.setAttribute("fill", "#fff");
        signText.textContent = "SCHOOL";
        svg.appendChild(signText);
    }
    
    // Draw lighting if enabled
    if (showLighting) {
        const light = document.createElementNS(svgNS, "circle");
        light.setAttribute("cx", "200");
        light.setAttribute("cy", "150");
        light.setAttribute("r", "15");
        light.setAttribute("fill", "#ff0");
        svg.appendChild(light);
        
        const pole = document.createElementNS(svgNS, "rect");
        pole.setAttribute("x", "195");
        pole.setAttribute("y", "150");
        pole.setAttribute("width", "10");
        pole.setAttribute("height", "50");
        pole.setAttribute("fill", "#888");
        svg.appendChild(pole);
    }
}

// Apply AI package based on last analysis
function applyAIPackage() {
    const lastAnalysis = window.RoadSphere.loadFromLocalStorage('lastAnalysis');
    
    if (lastAnalysis) {
        // Reset all toggles
        rumbleStrips.checked = false;
        guardrail.checked = false;
        signage.checked = false;
        zebraCrossing.checked = false;
        lighting.checked = false;
        
        // Apply interventions from last analysis
        lastAnalysis.interventions.forEach(intervention => {
            if (intervention.toLowerCase().includes('rumble')) {
                rumbleStrips.checked = true;
            }
            if (intervention.toLowerCase().includes('guardrail')) {
                guardrail.checked = true;
            }
            if (intervention.toLowerCase().includes('signage') || intervention.toLowerCase().includes('sign')) {
                signage.checked = true;
            }
            if (intervention.toLowerCase().includes('zebra') || intervention.toLowerCase().includes('crossing')) {
                zebraCrossing.checked = true;
            }
            if (intervention.toLowerCase().includes('lighting') || intervention.toLowerCase().includes('light')) {
                lighting.checked = true;
            }
        });
        
        // Redraw scene
        drawScene();
        
        // Show confirmation
        alert('AI Package Applied! Safety interventions from your last analysis have been activated.');
    } else {
        alert('No previous analysis found. Please analyze a scenario first on the Scenario & Results page.');
    }
}

// Start animation
function startAnimation() {
    if (isAnimating) return;
    
    isAnimating = true;
    document.getElementById('startAnimation').disabled = true;
    document.getElementById('stopAnimation').disabled = false;
    
    animate();
}

// Stop animation
function stopAnimation() {
    isAnimating = false;
    document.getElementById('startAnimation').disabled = false;
    document.getElementById('stopAnimation').disabled = true;
    
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

// Animation loop
function animate() {
    if (!isAnimating) return;
    
    // Update vehicle positions
    vehicles.forEach(vehicle => {
        vehicle.x += vehicle.speed;
        if (vehicle.x > 800) {
            vehicle.x = -50;
        }
    });
    
    // Update pedestrian positions
    pedestrians.forEach(pedestrian => {
        pedestrian.x += pedestrian.speedX;
        pedestrian.y += pedestrian.speedY;
        
        // Simple boundary checking
        if (pedestrian.x < 0 || pedestrian.x > 800) {
            pedestrian.speedX *= -1;
        }
        if (pedestrian.y < 200 || pedestrian.y > 400) {
            pedestrian.speedY *= -1;
        }
    });
    
    // Redraw scene
    drawScene();
    
    // Continue animation loop
    animationId = requestAnimationFrame(animate);
}

// Add a vehicle to the simulation
function addVehicle() {
    const vehicle = {
        id: Date.now(),
        x: -50,
        y: 170,
        speed: 2 + Math.random() * 3,
        type: Math.random() > 0.5 ? 'car' : 'truck'
    };
    
    vehicles.push(vehicle);
    drawScene();
}

// Add a pedestrian to the simulation
function addPedestrian() {
    const pedestrian = {
        id: Date.now(),
        x: 200 + Math.random() * 400,
        y: 250 + Math.random() * 100,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2
    };
    
    pedestrians.push(pedestrian);
    drawScene();
}

// Change weather effect
function changeWeather() {
    weatherEffect = document.getElementById('weatherEffect').value;
    drawScene();
}

// Draw a vehicle
function drawVehicle(svg, vehicle) {
    const svgNS = "http://www.w3.org/2000/svg";
    
    if (vehicle.type === 'car') {
        // Draw car body
        const carBody = document.createElementNS(svgNS, "rect");
        carBody.setAttribute("x", vehicle.x);
        carBody.setAttribute("y", vehicle.y);
        carBody.setAttribute("width", "40");
        carBody.setAttribute("height", "20");
        carBody.setAttribute("fill", "#3498db");
        carBody.setAttribute("rx", "5");
        svg.appendChild(carBody);
        
        // Draw car windows
        const carWindow = document.createElementNS(svgNS, "rect");
        carWindow.setAttribute("x", vehicle.x + 5);
        carWindow.setAttribute("y", vehicle.y + 3);
        carWindow.setAttribute("width", "30");
        carWindow.setAttribute("height", "14");
        carWindow.setAttribute("fill", "#aed6f1");
        svg.appendChild(carWindow);
        
        // Draw wheels
        const wheel1 = document.createElementNS(svgNS, "circle");
        wheel1.setAttribute("cx", vehicle.x + 10);
        wheel1.setAttribute("cy", vehicle.y + 25);
        wheel1.setAttribute("r", "5");
        wheel1.setAttribute("fill", "#333");
        svg.appendChild(wheel1);
        
        const wheel2 = document.createElementNS(svgNS, "circle");
        wheel2.setAttribute("cx", vehicle.x + 30);
        wheel2.setAttribute("cy", vehicle.y + 25);
        wheel2.setAttribute("r", "5");
        wheel2.setAttribute("fill", "#333");
        svg.appendChild(wheel2);
    } else {
        // Draw truck body
        const truckBody = document.createElementNS(svgNS, "rect");
        truckBody.setAttribute("x", vehicle.x);
        truckBody.setAttribute("y", vehicle.y - 10);
        truckBody.setAttribute("width", "60");
        truckBody.setAttribute("height", "30");
        truckBody.setAttribute("fill", "#e74c3c");
        truckBody.setAttribute("rx", "5");
        svg.appendChild(truckBody);
        
        // Draw truck cabin
        const cabin = document.createElementNS(svgNS, "rect");
        cabin.setAttribute("x", vehicle.x + 40);
        cabin.setAttribute("y", vehicle.y - 15);
        cabin.setAttribute("width", "25");
        cabin.setAttribute("height", "20");
        cabin.setAttribute("fill", "#c0392b");
        cabin.setAttribute("rx", "3");
        svg.appendChild(cabin);
        
        // Draw wheels
        const wheel1 = document.createElementNS(svgNS, "circle");
        wheel1.setAttribute("cx", vehicle.x + 15);
        wheel1.setAttribute("cy", vehicle.y + 25);
        wheel1.setAttribute("r", "6");
        wheel1.setAttribute("fill", "#333");
        svg.appendChild(wheel1);
        
        const wheel2 = document.createElementNS(svgNS, "circle");
        wheel2.setAttribute("cx", vehicle.x + 45);
        wheel2.setAttribute("cy", vehicle.y + 25);
        wheel2.setAttribute("r", "6");
        wheel2.setAttribute("fill", "#333");
        svg.appendChild(wheel2);
    }
}

// Draw a pedestrian
function drawPedestrian(svg, pedestrian) {
    const svgNS = "http://www.w3.org/2000/svg";
    
    // Draw pedestrian body
    const body = document.createElementNS(svgNS, "ellipse");
    body.setAttribute("cx", pedestrian.x);
    body.setAttribute("cy", pedestrian.y);
    body.setAttribute("rx", "8");
    body.setAttribute("ry", "15");
    body.setAttribute("fill", "#9b59b6");
    svg.appendChild(body);
    
    // Draw pedestrian head
    const head = document.createElementNS(svgNS, "circle");
    head.setAttribute("cx", pedestrian.x);
    head.setAttribute("cy", pedestrian.y - 20);
    head.setAttribute("r", "10");
    head.setAttribute("fill", "#f1c40f");
    svg.appendChild(head);
}

// Draw weather effects
function drawWeatherEffect(svg, effect) {
    const svgNS = "http://www.w3.org/2000/svg";
    
    switch(effect) {
        case 'rain':
            // Draw rain drops
            for (let i = 0; i < 50; i++) {
                const drop = document.createElementNS(svgNS, "line");
                const x = Math.random() * 800;
                const y = Math.random() * 200;
                drop.setAttribute("x1", x);
                drop.setAttribute("y1", y);
                drop.setAttribute("x2", x - 5);
                drop.setAttribute("y2", y + 15);
                drop.setAttribute("stroke", "#3498db");
                drop.setAttribute("stroke-width", "2");
                svg.appendChild(drop);
            }
            break;
            
        case 'fog':
            // Draw fog
            for (let i = 0; i < 10; i++) {
                const fog = document.createElementNS(svgNS, "ellipse");
                fog.setAttribute("cx", Math.random() * 800);
                fog.setAttribute("cy", 50 + Math.random() * 100);
                fog.setAttribute("rx", 50 + Math.random() * 100);
                fog.setAttribute("ry", 10 + Math.random() * 20);
                fog.setAttribute("fill", "rgba(255, 255, 255, 0.3)");
                svg.appendChild(fog);
            }
            break;
            
        case 'snow':
            // Draw snowflakes
            for (let i = 0; i < 100; i++) {
                const flake = document.createElementNS(svgNS, "circle");
                flake.setAttribute("cx", Math.random() * 800);
                flake.setAttribute("cy", Math.random() * 200);
                flake.setAttribute("r", "2");
                flake.setAttribute("fill", "#fff");
                svg.appendChild(flake);
            }
            break;
    }
}