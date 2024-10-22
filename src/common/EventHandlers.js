 /**
  * This file contains all the EventHandlers which include the event listeners for 
  * the keyboard and window resize events, and any other event listeners that 
  * may be needed in the future.
  */

// Track key states
const keyState = {};
import * as THREE from 'three';

import { 
    INVERSE_MOTION_THRESHOLD, 
    INVERSE_ROTATION_THRESHOLD, 
    MOTION_THRESHOLD, 
    ROTATION_THRESHOLD 
} from './Constants.js';

// Store initial positions and rotations
const initialState = {
    body: {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(1.7, 0, 0)
    },

    armPivot: {
        position: new THREE.Vector3(-0.08, 0.01, -0.07),
        rotation: new THREE.Euler(0, 0, 0)
    },
    
    handPivot: {
        position: new THREE.Vector3(0, 0, 0.12),
        rotation: new THREE.Euler(0, 0, 0)
    }
};

// Setup event listeners for key tracking and actions
export function setupEventListeners({ body, armPivot, handPivot, renderer, camera }, limits) {
    // Track keydown events
    document.addEventListener('keydown', (event) => {
        if (event.key === 'q') {
            resetAll(body, armPivot, handPivot); // Reset everything on 'q' press
        } else {
            keyState[event.key] = true; // Mark the key as pressed
        }
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

    // Start the animation loop
    animate(body, armPivot, handPivot, limits);
}

// Reset function to return everything to the initial state
function resetAll(body, armPivot, handPivot) {
    // Clear all key states to stop any ongoing actions
    for (const key in keyState) {
        keyState[key] = false;
    }

    // Reset body position and rotation
    body.setPosition(
        initialState.body.position.x,
        initialState.body.position.y,
        initialState.body.position.z
    );
    body.setRotation(
        initialState.body.rotation.x,
        initialState.body.rotation.y,
        initialState.body.rotation.z
    );

    // Reset armPivot position and rotation
    armPivot.position.copy(initialState.armPivot.position);
    armPivot.rotation.copy(initialState.armPivot.rotation);

    // Reset handPivot position and rotation
    handPivot.position.copy(initialState.handPivot.position);
    handPivot.rotation.copy(initialState.handPivot.rotation);
}

// Animation loop to apply transformations continuously
function animate(body, armPivot, handPivot, limits) {
    requestAnimationFrame(() => animate(body, armPivot, handPivot, limits));

    // Apply movements and rotations based on key states
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
}