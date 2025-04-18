import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Global state
export const state = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    gameStarted: false,
    gameOver: false,
    levelComplete: false,
    showHelpers: false,
    showTrajectory: true,
    score: 0,
    level: 1,
    currentCameraIndex: 0,
    usingOrthographic: false,
    ball: null,
    paddle: null,
    bricks: [],
    ballVelocity: new THREE.Vector3(0.1, 0.1, 0.08),
    keys: {
        left: false,
        right: false,
        up: false,
        down: false
    },
    mousePosition: { x: 0, z: 0 },
    useMouse: true,
    cameras: [],
    lights: {
        ambient: null,
        directional: null,
        point: null,
        spotlight: null,
        hemispheric: null
    },
    lightsEnabled: {
        ambient: true,
        directional: true,
        point: true,
        spotlight: false,
        hemispheric: false
    },
    trajectoryObjects: [],
    trajectoryColor: 0xff0000
};

// Constants for game dimensions
export const constants = {
    BALL_SPEED: 0.2,
    GAME_WIDTH: 40,
    GAME_HEIGHT: 50,
    GAME_DEPTH: 40,
    BRICK_WIDTH: 4,
    BRICK_HEIGHT: 2,
    BRICK_DEPTH: 2,
    PADDLE_WIDTH: 10,
    PADDLE_HEIGHT: 1,
    PADDLE_DEPTH: 10,
    BALL_RADIUS: 0.8,
    PADDLE_SPEED: 0.5,
    MAX_LEVELS: 3
};

// Initialize the game
export function initGame() {
    console.log("Initializing game...");
    
    // Create scene
    state.scene = new THREE.Scene();
    state.scene.background = new THREE.Color(0x111122);

    // Create renderer BEFORE cameras are setup
    state.renderer = new THREE.WebGLRenderer({ antialias: true });
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    state.renderer.shadowMap.enabled = true;
    document.body.appendChild(state.renderer.domElement);
    
    try {
        // Setup cameras - now the renderer exists
        setupCameras();
        
        // Set up lighting
        setupLighting();
    
        // Create game objects
        createGameArea();
        createPaddle();
        createBall();
        createBricks();
        
        // Create trajectory visualization
        createTrajectoryLine();
        
        // Create UI
        createGameUI();
    
        // Setup input handlers
        setupInputListeners();
        setupGameClickHandler();
    
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
    
        // Add debugging controls
        addDebugControls();
        
        // Start animation loop
        animate();
        
        // Apply body styles
        document.body.style.backgroundColor = "#000";
        document.body.style.margin = "0";
        document.body.style.overflow = "hidden";
        
        // Display initial instructions
        displayMessage("Brick Breaker 3D", "Click to Start");
        
        console.log("Game initialized successfully");
    } catch (error) {
        console.error("Error during game initialization:", error);
        throw error;
    }
}

// Since these functions need to be imported, let's use a separate 
// import statement here to avoid circular dependencies
import { setupCameras } from './cameras.js';
import { setupLighting } from './lighting.js';
import { createGameArea, createPaddle, createBall, createBricks } from './objects.js';
import { setupInputListeners } from './controls.js';
import { createTrajectoryLine } from './trajectory.js';
import { createGameUI, displayMessage } from './ui.js';

// Declaration for functions that need to be implemented
function onWindowResize() {
    if (!state.renderer) return;
    
    state.cameras.forEach(camera => {
        if (camera.type === 'PerspectiveCamera') {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        } else if (camera.type === 'OrthographicCamera') {
            const aspectRatio = window.innerWidth / window.innerHeight;
            const viewSize = 60;
            camera.left = -viewSize * aspectRatio / 2;
            camera.right = viewSize * aspectRatio / 2;
            camera.top = viewSize / 2;
            camera.bottom = -viewSize / 2;
            camera.updateProjectionMatrix();
        }
    });
    
    state.renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    if (!state.renderer) return;
    
    requestAnimationFrame(animate);
    
    // Update controls if they exist
    if (state.controls) {
        state.controls.update();
    }
    
    // Update trajectory visualization
    updateTrajectory();
    
    // Update game objects if not in level complete state
    if (!state.levelComplete) {
        updateObjects();
    }
    
    // Render the scene
    state.renderer.render(state.scene, state.camera);
}

// We need these imports for the animate function
import { updateTrajectory } from './trajectory.js';
import { updateObjects } from './objects.js';

// Game restart
export function resetGame() {
    state.gameOver = false;
    state.levelComplete = false;
    state.gameStarted = false;
    
    resetBall();
    createBricks();
    
    // Reset paddle position
    if (state.paddle) {
        state.paddle.position.set(0, -constants.GAME_HEIGHT/2 + constants.PADDLE_HEIGHT, 0);
    }
    
    console.log("Game reset complete");
}

// Game start
export function startGame() {
    if (state.gameStarted) return;
    
    console.log("Starting game...");
    state.gameStarted = true;
    
    // Update trajectory visibility
    updateTrajectory();
    
    // Remove any displayed messages
    const existingMessage = document.getElementById('game-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Import resetBall for resetGame
import { resetBall } from './objects.js';

// Setup click handler for all game states
function setupGameClickHandler() {
    document.removeEventListener('click', handleGameClick);
    document.addEventListener('click', handleGameClick);
}

// Handle click events based on game state
function handleGameClick(event) {
    if (state.levelComplete) {
        resetGame();
        state.levelComplete = false;
        return;
    }
    
    if (state.gameOver) {
        resetGame();
        return;
    }
    
    if (!state.gameStarted) {
        startGame();
        return;
    }
}

// Add debug controls
function addDebugControls() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'r') {
            resetGame();
        }
        if (event.key === 't') {
            toggleTrajectory();
        }
        if (event.key === 'o') {
            toggleCameraType();
        }
    });
}
