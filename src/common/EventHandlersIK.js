const keyState = {};
import * as THREE from 'three';
import {
    INVERSE_MOTION_THRESHOLD, 
    INVERSE_ROTATION_THRESHOLD, 
    MOTION_THRESHOLD, 
    ROTATION_THRESHOLD 
} from './Constants.js';


export function setupEventListeners({ body, armPivot, handPivot, renderer, camera }, limits) {
    document.addEventListener('keydown', (event) => {
        const keysToPrevent = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (keysToPrevent.includes(event.key)) {
            event.preventDefault(); // Prevent default scroll behavior
        }

        if (event.key === 'q') {
            resetAll(body, armPivot, handPivot); // Reset everything on 'q' press
        } else {
            keyState[event.key] = true;
        }
    });

    document.addEventListener('keyup', (event) => {
        keyState[event.key] = false;
    });

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    animate(body, armPivot, handPivot, limits);
}

// Function to move the hand with 'h', 'j', 'k', 'l'
function moveHand(handPivot) {
    const step = 0.02; // Step size for movement

    if (keyState['h']) {
        handPivot.position.z -= step; // Move left
    }
    if (keyState['l']) {
        handPivot.position.z += step; // Move right
    }
    if (keyState['j']) {
        handPivot.position.x -= step; // Move down
    }
    if (keyState['k']) {
        handPivot.position.x += step; // Move up
    }
}

// Function to apply inverse kinematics to the arm
function applyIK(armPivot, handPivot) {
    const armPos = armPivot.position;
    const handPos = handPivot.position;

    // Calculate the angle between the arm and the hand using atan2
    const deltaX = handPos.z - armPos.z;
    const deltaY = handPos.x - armPos.x;
    const angle = Math.atan2(deltaY, deltaX);

    // Set the arm's rotation to align with the hand's position
    armPivot.rotation.z = angle;
}

// Animation loop to apply transformations continuously
function animate(body, armPivot, handPivot, limits) {
    requestAnimationFrame(() => animate(body, armPivot, handPivot, limits));

    // Apply body movements
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

    // Move the hand based on 'h', 'j', 'k', 'l' inputs
    moveHand(handPivot);

    // Apply inverse kinematics to align the arm with the hand
    applyIK(armPivot, handPivot);
}