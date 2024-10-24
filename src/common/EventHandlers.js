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
    ROTATION_THRESHOLD,
} from './Constants.js';

// Setup event listeners for key tracking and actions
export function setupEventListeners(
    { body, armPivot, handPivot, renderer, camera }, limits, initialState
) {
    // Track keydown events
    document.addEventListener('keydown', (event) => {
        // Prevent default scrolling for arrow keys and others if necessary
        const keysToPrevent = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (keysToPrevent.includes(event.key)) {
            event.preventDefault(); // Prevent default scroll behavior
        }
        
        if (event.key === 'x') {
            resetAll(body, armPivot, handPivot, initialState); // Reset everything on 'q' press
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
function resetAll(body, armPivot, handPivot, initialState) {
    for (const key in keyState) keyState[key] = false; // Clear all key states

    // Reset body position and rotation
    body.setPosition(...initialState.body.position);
    body.setRotation(...initialState.body.rotation);

    // Reset armPivot position and rotation
    armPivot.position.copy(new THREE.Vector3(...initialState.armPivot.position));
    armPivot.rotation.copy(new THREE.Euler(...initialState.armPivot.rotation));

    // Reset handPivot position and rotation
    handPivot.position.copy(new THREE.Vector3(...initialState.handPivot.position));
    handPivot.rotation.copy(new THREE.Euler(...initialState.handPivot.rotation));
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
        body.rotate(0, 0, ROTATION_THRESHOLD);
    }
    if (keyState['d']) {
        body.rotate(0, 0, INVERSE_ROTATION_THRESHOLD);
    }
    if (keyState['q']) {
        body.rotate(0, ROTATION_THRESHOLD, 0);
    }
    if (keyState['e']) {
        body.rotate(0, INVERSE_ROTATION_THRESHOLD, 0);
    }
    if (keyState['w']) {
        body.rotate(ROTATION_THRESHOLD, 0, 0);
    }
    if (keyState['s']) {
        body.rotate(INVERSE_ROTATION_THRESHOLD, 0, 0);
    }
    if (keyState['l']) {
        armPivot.rotation.y -= ROTATION_THRESHOLD;
    }
    if (keyState['h']) {
        armPivot.rotation.y += ROTATION_THRESHOLD;
    }
    if (keyState['k']) {
        handPivot.rotation.y -= ROTATION_THRESHOLD;
    }
    if (keyState['j']) {
        handPivot.rotation.y += ROTATION_THRESHOLD;
    }
}

export function displayMouseCoordinates(x, y) {
    const coordinatesElement = document.getElementById('mouse-coordinates');
    coordinatesElement.textContent = `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;
}

// Get normalized mouse position (-1 to 1)
export function getNormalizedMousePosition(event, renderer) {
    const rect = renderer.domElement.getBoundingClientRect();
    return {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1
    };
}

// Convert normalized coordinates to 3D world space
export function convertTo3DCoordinates(x, y, camera) {
    const vector = new THREE.Vector3(x, y, 0.5); // 0.5 = z position in NDC
    vector.unproject(camera); // Convert from NDC to world coordinates
    vector.sub(camera.position).normalize(); // Get direction from camera to the point

    // Project the point onto a plane at z = 0
    const distance = -camera.position.z / vector.z;
    return camera.position.clone().add(vector.multiplyScalar(distance));
}