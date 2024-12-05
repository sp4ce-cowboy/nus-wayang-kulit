 /**
 * This file contains all the EventHandlers which include the event listeners for 
 * the keyboard and window resize events, and any other event listeners that 
 * may be needed in the future.
 */
 
 import * as THREE from 'three';
 import axios from 'axios';
 
 import {
    INVERSE_MOTION_THRESHOLD, 
    INVERSE_ROTATION_THRESHOLD, 
    MOTION_THRESHOLD, 
    ROTATION_THRESHOLD,
} from './Constants.js';

import { applyInverseKinematics } from './InverseKinematics.js';
import {
    displayMouseCoordinates,
    displayPivotPositions,
    displayProjectedMouseCoordinates,
    displayTargetDistance,
    displayMouseAndEndPositions
} from './InfoDisplay.js';

// Track key states
const keyState = {};
export let mousePosition = new THREE.Vector3(0.1,0.1,0.02);
export let armToEndDistance = 0;
export let armToHandDistance = 0;
export let handToEndDistance = 0;

// Setup event listeners for key tracking and actions
export function setupEventListeners(
    { body, armPivot, handPivot, endEffector, renderer, camera }, limits, initialState
) {
    // Track keydown events
    document.addEventListener('keydown', (event) => {
        const keysToPrevent = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (keysToPrevent.includes(event.key)) {
            event.preventDefault(); // Prevent default scroll behavior
        }
        
        if (event.key === 'x') {
            resetAll(body, armPivot, handPivot, initialState);
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
    
    /*renderer.domElement.addEventListener('mousemove', (event) => {
        const { x, y } = getNormalizedMousePosition(event, renderer);
        const coords = convertTo3DCoordinates(x, y, camera);
        
        mousePosition.copy(coords); // Store the 3D coordinates
        displayMouseCoordinates(mousePosition.x, mousePosition.y);
    });*/

    // Add support for touch events on mobile devices
    /*renderer.domElement.addEventListener('touchmove', (event) => {
        const { x, y } = getNormalizedMousePosition(event, renderer);
        const coords = convertTo3DCoordinates(x, y, camera);
        
        mousePosition.copy(coords); // Store the 3D coordinates
        displayMouseCoordinates(mousePosition.x, mousePosition.y);
    });*/
    
    // Start the animation loop
    animate(body, armPivot, handPivot, endEffector, limits);
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

async function fetchMousePosition() {
    try {
        const response = await axios.get('http://localhost:3000/detect'); // Replace $URL with your actual endpoint
        const data = response.data;

        // Assuming data contains the mouse position in the format { x: number, y: number, z: number }
        let mousePosFetch  = new THREE.Vector3(data.smallArmTop.x, data.smallArmTop.y, 0.02);
        mousePosition = mousePosFetch.clone();
    } catch (error) {
        console.error('Error fetching mouse position:', error);
    }
}

// Animation loop to apply movements and updates continuously
async function animate(body, armPivot, handPivot, endEffector, limits) {
    requestAnimationFrame(() => animate(body, armPivot, handPivot, endEffector, limits));

    displayPivotPositions(armPivot, handPivot);

    armToEndDistance = getVectorDistance(armPivot, endEffector);
    armToHandDistance = getArmPivotToHandPivotDistance(armPivot, handPivot)
    handToEndDistance = getHandPivotToEndEffectorDistance(handPivot, endEffector)
    
    await fetchMousePosition();
    let tempMousePosition = mousePosition.clone();
    tempMousePosition.setZ(0.02);

    let maxMousePosition = getMaxPossibleMousePosition(tempMousePosition, armPivot);
    
    //var manualMousePosition = maxMousePosition.clone();
    //manualMousePosition.setY(0.1);
    //manualMousePosition.setX(0.1);
    //manualMousePosition.setZ(0.1);
    //maxMousePosition = manualMousePosition;

    displayAllVectorDistances(armToEndDistance, armToHandDistance, handToEndDistance);
    displayProjectedMouseCoordinates(maxMousePosition);

    let currentTargetDistance = getTargetToShoulderDistance(armPivot, maxMousePosition);
    displayTargetDistance(currentTargetDistance);

    const endEffectorPosition = new THREE.Vector3();
    endEffector.getWorldPosition(endEffectorPosition);
    displayMouseAndEndPositions(maxMousePosition, endEffectorPosition);

    applyInverseKinematics(maxMousePosition, currentTargetDistance, armPivot, handPivot, body);
    handleKeyMovements(body, armPivot, handPivot, limits);
}

function handleKeyMovements(body, armPivot, handPivot, limits) {
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
        console.log('Z position:', body.mesh.position.z);
    }
    if (keyState[',']) {
        body.move(0, 0, Math.max(limits.z.min, body.mesh.position.z - MOTION_THRESHOLD) - body.mesh.position.z);
        console.log('Z position:', body.mesh.position.z);
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

// Get the vector distance between two pivots (Three.Groups)
export function getVectorDistance(armPivot, endEffector) {
    // Ensure the positions are up to date
    armPivot.updateMatrixWorld();
    endEffector.updateMatrixWorld();
    
    // Get world positions
    const armPosition = new THREE.Vector3();
    const endEffectorPosition = new THREE.Vector3();
    
    armPivot.getWorldPosition(armPosition);
    endEffector.getWorldPosition(endEffectorPosition);
    
    // Calculate vector distance
    //const distance = armPosition.distanceTo(endEffectorPosition);
    const distance = get2DVectorDistance(armPosition, endEffectorPosition);
    return distance;
}

export function get2DVectorDistance(vector1, vector2) {
    return Math.sqrt(Math.abs((Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2))));
}

export function displayVectorDistance(distance) {
    // Update the distance display on the screen
    const display = document.getElementById('distanceDisplay');
    display.innerHTML = `Distance: ${distance.toFixed(3)}`;
}

export function displayAllVectorDistances(distance1, distance2, distance3) {
    // Update the distance display on the screen
    const display = document.getElementById('distanceDisplay');
    display.innerHTML = `Distance: ${distance1.toFixed(4)},
    ArmToHand: ${distance2.toFixed(3)},
    HandToEnd: ${distance3.toFixed(3)}`;
}

export function getArmPivotToHandPivotDistance(armPivot, handPivot) {
    armPivot.updateMatrixWorld();
    handPivot.updateMatrixWorld();
    
    const armPosition = new THREE.Vector3();
    const handPosition = new THREE.Vector3();
    
    armPivot.getWorldPosition(armPosition);
    handPivot.getWorldPosition(handPosition);
    
    //const distance = armPosition.distanceTo(handPosition);
    const distance = get2DVectorDistance(armPosition, handPosition);
    return distance;
}

export function getHandPivotToEndEffectorDistance(handPivot, endEffector) {
    handPivot.updateMatrixWorld();
    endEffector.updateMatrixWorld();
    
    const handPosition = new THREE.Vector3();
    const endEffectorPosition = new THREE.Vector3();
    
    handPivot.getWorldPosition(handPosition);
    endEffector.getWorldPosition(endEffectorPosition);
    
    //const distance = handPosition.distanceTo(endEffectorPosition);
    const distance = get2DVectorDistance(handPosition, endEffectorPosition);
    return distance;
}

/* The vector distance calculations here must be in 2D space */
export function getTargetToShoulderDistance(armPivot, targetPosition) {
    armPivot.updateMatrixWorld();
    
    const armPivotPosition = new THREE.Vector3();
    armPivot.getWorldPosition(armPivotPosition);
    
    const distance = armPivotPosition.distanceTo(targetPosition);
    //const distance = get2DVectorDistance(targetPosition, armPivotPosition);
    return distance;
}

export function getMaxPossibleMousePosition(mousePosition, armPivot) {
    const armLength = armToHandDistance;
    const handLength = handToEndDistance;

    // Get the origin as the world position of the armPivot
    const origin = new THREE.Vector3();
    armPivot.getWorldPosition(origin);

    // Maximum allowed radius of the circle
    const maxRadius = armLength + handLength;

    // Calculate the vector from the armPivot (origin) to the mouse position
    const deltaX = mousePosition.x - origin.x;
    const deltaY = mousePosition.y - origin.y;

    // Calculate the distance from the armPivot to the mouse position
    const mouseDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // If the mouse is within the allowed radius, return the original mouse position
    if (mouseDistance <= maxRadius) {
        return mousePosition;
    }

    // Otherwise, clamp the position to the circle's edge
    const scaleFactor = maxRadius / mouseDistance;
    const clampedX = origin.x + deltaX * scaleFactor;
    const clampedY = origin.y + deltaY * scaleFactor;

    // Return the new position on the circle's boundary
    return new THREE.Vector3(clampedX, clampedY, mousePosition.z);
}