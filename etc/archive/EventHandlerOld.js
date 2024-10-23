// Track key states
/*const keyState = {};

// Constants for movement and rotation
import { 
    INVERSE_MOTION_THRESHOLD, 
    INVERSE_ROTATION_THRESHOLD, 
    MOTION_THRESHOLD, 
    ROTATION_THRESHOLD 
} from './Constants.js';

// Main event listener setup function
export function setupEventListeners({ body, armPivot, handPivot, renderer, camera }, limits) {
    // Track keydown events
    document.addEventListener('keydown', (event) => {
        keyState[event.key] = true; // Mark the key as pressed
    });

    // Track keyup events
    document.addEventListener('keyup', (event) => {
        keyState[event.key] = false; // Mark the key as released
    });

    // Handle window resize events
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Start the animation loop to apply continuous movement/rotation
    animate(body, armPivot, handPivot, limits);
}

// Animation loop to apply transformations continuously
function animate(body, armPivot, handPivot, limits) {
    requestAnimationFrame(() => animate(body, armPivot, handPivot, limits));

    // Check key states and apply movements/rotations accordingly
    if (keyState['ArrowLeft']) {
        body.move(Math.max(limits.x.min, body.mesh.position.x - MOTION_THRESHOLD) - body.mesh.position.x, 0, 0);
    }
    if (keyState['ArrowRight']) {
        body.move(Math.min(limits.x.max, body.mesh.position.x + MOTION_THRESHOLD) - body.mesh.position.x, 0, 0);
    }
    if (keyState['ArrowUp']) {
        body.move(0, Math.min(limits.y.max, body.mesh.position.y + MOTION_THRESHOLD) - body.mesh.position.y, 0);
    }
    if (keyState['ArrowDown']) {
        body.move(0, Math.max(limits.y.min, body.mesh.position.y - MOTION_THRESHOLD) - body.mesh.position.y, 0);
    }
    if (keyState['.']) {
        body.move(0, 0, Math.min(limits.z.max, body.mesh.position.z + MOTION_THRESHOLD) - body.mesh.position.z);
    }
    if (keyState[',']) {
        body.move(0, 0, Math.max(limits.z.min, body.mesh.position.z - MOTION_THRESHOLD) - body.mesh.position.z);
    }
    if (keyState['a']) {
        body.rotate(0, 0, MOTION_THRESHOLD);
    }
    if (keyState['d']) {
        body.rotate(0, 0, INVERSE_MOTION_THRESHOLD);
    }
    if (keyState['w']) {
        body.rotate(0, ROTATION_THRESHOLD, 0);
    }
    if (keyState['s']) {
        body.rotate(0, INVERSE_ROTATION_THRESHOLD, 0);
    }
    if (keyState['q']) {
        body.setPosition(0, 0, 0);
        body.setRotation(1.7, 0, 0);
    }
    if (keyState['z']) {
        body.rotate(ROTATION_THRESHOLD, 0, 0);
    }
    if (keyState['x']) {
        body.rotate(INVERSE_ROTATION_THRESHOLD, 0, 0);
    }
    if (keyState['r']) {
        armPivot.rotation.y -= ROTATION_THRESHOLD;
    }
    if (keyState['t']) {
        armPivot.rotation.y += ROTATION_THRESHOLD;
    }
    if (keyState['f']) {
        handPivot.rotation.y -= ROTATION_THRESHOLD;
    }
    if (keyState['g']) {
        handPivot.rotation.y += ROTATION_THRESHOLD;
    }
}*/

 //import './Constants.js';
//import { INVERSE_MOTION_THRESHOLD,INVERSE_ROTATION_THRESHOLD, MOTION_THRESHOLD, ROTATION_THRESHOLD } from './Constants.js';
 
 /**
  * This file contains all the EventHandlers which include the event listeners for 
  * the keyboard and window resize events, and any other event listeners that 
  * may be needed in the future.
  */
 /*export function setupEventListeners({ body, armPivot, handPivot, renderer, camera }, limits) {
    document.addEventListener('keydown', (event) => {
        //const body = puppetParts.body;  // Body is the main puppet part

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                body.move(Math.max(limits.x.min, body.mesh.position.x - MOTION_THRESHOLD) - body.mesh.position.x, 0, 0);
                break;
            case 'ArrowRight':
                event.preventDefault();
                body.move(Math.min(limits.x.max, body.mesh.position.x + MOTION_THRESHOLD) - body.mesh.position.x, 0, 0);
                break;
            case 'ArrowUp':
                event.preventDefault();
                body.move(0, Math.min(limits.y.max, body.mesh.position.y + MOTION_THRESHOLD) - body.mesh.position.y, 0);
                break;
            case 'ArrowDown':
                event.preventDefault();
                body.move(0, Math.max(limits.y.min, body.mesh.position.y - MOTION_THRESHOLD) - body.mesh.position.y, 0);
                break;
            case '.':
                event.preventDefault();
                body.move(0, 0, Math.min(limits.z.max, body.mesh.position.z + MOTION_THRESHOLD) - body.mesh.position.z);
                break;
            case ',':
                event.preventDefault();
                body.move(0, 0, Math.max(limits.z.min, body.mesh.position.z - MOTION_THRESHOLD) - body.mesh.position.z);
                break;
            case 'a':
                body.rotate(0, 0, MOTION_THRESHOLD);
                break;
            case 'd':
                body.rotate(0, 0, INVERSE_MOTION_THRESHOLD);
                break;
            case 'w':
                body.rotate(0, ROTATION_THRESHOLD, 0);
                break;
            case 's':
                body.rotate(0, INVERSE_ROTATION_THRESHOLD, 0);
                break;
            case 'q':
                //body.setPosition(-3, 4, 0);  // Corrected position
                body.setRotation(1.7, 0, 0); // Corrected rotation
                body.setPosition(0, 0, 0); // Set initial position
                break;
            case 'z': // Anticlockwise rotation
                body.rotate(ROTATION_THRESHOLD, 0, 0); // Rotate around X-axis anticlockwise
                break;
            case 'x': // Clockwise rotation
                body.rotate(INVERSE_ROTATION_THRESHOLD, 0, 0); // Rotate around X-axis clockwise
                break;
            // Rotate the arm clockwise with 'r'
            case 'r':
                armPivot.rotation.y -= ROTATION_THRESHOLD;
                break;
            // Rotate the arm anticlockwise with 't'
            case 't':
                armPivot.rotation.y += ROTATION_THRESHOLD;
                break;
            // Rotate the hand clockwise with 'f'
            case 'f':
                handPivot.rotation.y -= ROTATION_THRESHOLD;
                break;
            
            // Rotate the hand anticlockwise with 'g'
                case 'g':
                handPivot.rotation.y += ROTATION_THRESHOLD;
                break;
        }
    });

    window.addEventListener('resize', () => {
        puppetParts.renderer.setSize(window.innerWidth, window.innerHeight);
        puppetParts.camera.aspect = window.innerWidth / window.innerHeight;
        puppetParts.camera.updateProjectionMatrix();
    });
}*/