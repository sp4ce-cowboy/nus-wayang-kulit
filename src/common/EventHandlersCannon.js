/**
 * This file contains all the EventHandlers which include the event listeners for 
 * the keyboard and window resize events, and any other event listeners that 
 * may be needed in the future.
 */

// Track key states
const keyState = {};

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

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
            resetAll(body, armPivot, handPivot, initialState); // Reset everything on 'x' press
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

    // Reset body physics and mesh position/rotation
    resetPhysicsAndMesh(body, initialState.body);

    // Reset armPivot physics and mesh
    resetPhysicsAndMesh(armPivot, initialState.armPivot);

    // Reset handPivot physics and mesh
    resetPhysicsAndMesh(handPivot, initialState.handPivot);
}

// Helper function to reset physics body and mesh to initial state
function resetPhysicsAndMesh(part, initialState) {
    part.physicsBody.position.set(...initialState.position);
    part.physicsBody.quaternion.setFromEuler(...initialState.rotation);

    part.mesh.position.copy(part.physicsBody.position);
    part.mesh.quaternion.copy(part.physicsBody.quaternion);
}

// Animation loop to apply transformations continuously
function animate(body, armPivot, handPivot, limits) {
    requestAnimationFrame(() => animate(body, armPivot, handPivot, limits));

    const timeStep = 1 / 60; // 60 FPS

    // Step the physics world
    body.physicsWorld.step(timeStep);

    // Sync the meshes with their physics bodies
    syncPhysicsWithMesh(body);
    syncPhysicsWithMesh(armPivot);
    syncPhysicsWithMesh(handPivot);

    // Apply movements and rotations based on key states
    handleMovementAndRotation(body, armPivot, handPivot, limits);
}

// Sync the physics body with the corresponding mesh
function syncPhysicsWithMesh(part) {
    part.mesh.position.copy(part.physicsBody.position);
    part.mesh.quaternion.copy(part.physicsBody.quaternion);
}

// Handle movement and rotation based on key states
function handleMovementAndRotation(body, armPivot, handPivot, limits) {
    if (keyState['ArrowLeft']) {
        applyForce(body.physicsBody, -MOTION_THRESHOLD, 0, 0, limits.x.min, 'x');
    }
    if (keyState['ArrowRight']) {
        applyForce(body.physicsBody, MOTION_THRESHOLD, 0, 0, limits.x.max, 'x');
    }
    if (keyState['ArrowUp']) {
        applyForce(body.physicsBody, 0, MOTION_THRESHOLD, 0, limits.y.max, 'y');
    }
    if (keyState['ArrowDown']) {
        applyForce(body.physicsBody, 0, -MOTION_THRESHOLD, 0, limits.y.min, 'y');
    }
    if (keyState['.']) {
        applyForce(body.physicsBody, 0, 0, MOTION_THRESHOLD, limits.z.max, 'z');
    }
    if (keyState[',']) {
        applyForce(body.physicsBody, 0, 0, -MOTION_THRESHOLD, limits.z.min, 'z');
    }
    if (keyState['a']) {
        rotatePhysicsBody(body.physicsBody, 0, 0, ROTATION_THRESHOLD);
    }
    if (keyState['d']) {
        rotatePhysicsBody(body.physicsBody, 0, 0, -ROTATION_THRESHOLD);
    }
    if (keyState['q']) {
        rotatePhysicsBody(body.physicsBody, 0, ROTATION_THRESHOLD, 0);
    }
    if (keyState['e']) {
        rotatePhysicsBody(body.physicsBody, 0, -ROTATION_THRESHOLD, 0);
    }
    if (keyState['w']) {
        rotatePhysicsBody(body.physicsBody, ROTATION_THRESHOLD, 0, 0);
    }
    if (keyState['s']) {
        rotatePhysicsBody(body.physicsBody, -ROTATION_THRESHOLD, 0, 0);
    }
    if (keyState['h']) {
        rotatePhysicsBody(armPivot.physicsBody, 0, ROTATION_THRESHOLD, 0);
    }
    if (keyState['l']) {
        rotatePhysicsBody(armPivot.physicsBody, 0, -ROTATION_THRESHOLD, 0);
    }
    if (keyState['j']) {
        rotatePhysicsBody(handPivot.physicsBody, 0, ROTATION_THRESHOLD, 0);
    }
    if (keyState['k']) {
        rotatePhysicsBody(handPivot.physicsBody, 0, -ROTATION_THRESHOLD, 0);
    }
}

// Apply force to the physics body
function applyForce(physicsBody, x, y, z, limit, axis) {
    const currentPos = physicsBody.position[axis];
    if ((x < 0 && currentPos > limit) || (x > 0 && currentPos < limit)) {
        physicsBody.applyForce(new CANNON.Vec3(x, y, z), physicsBody.position);
    }
}

// Rotate the physics body
function rotatePhysicsBody(physicsBody, x, y, z) {
    const quaternion = new CANNON.Quaternion();
    quaternion.setFromEuler(x, y, z);
    physicsBody.quaternion.mult(quaternion, physicsBody.quaternion);
}