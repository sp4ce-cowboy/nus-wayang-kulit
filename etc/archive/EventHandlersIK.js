import * as THREE from 'three';

/**
 * This file contains all the EventHandlers which include the event listeners for 
 * mouse-based 2D inverse kinematics and other events.
 */

export function setupEventListeners({ armPivot, handPivot, renderer, camera }, limits, config) {
    // Get the configuration values for the arm and hand pivots
    const root = new THREE.Vector3(...config.arm.pivotPosition);  // Root is arm's pivot position
    const segmentLength = 0.1;  // Example logic for arm segment length

    // Update world matrices to ensure correct transformations
    armPivot.updateMatrixWorld();
    handPivot.updateMatrixWorld();

    // Mouse move listener to control IK
    document.addEventListener('mousemove', (event) => {
        const mousePosition = getMousePositionInScene(event, renderer, camera);

        // Call the drawArm function to apply inverse kinematics logic
        drawArm(mousePosition.x, mousePosition.y, -1, root, segmentLength, armPivot, handPivot);
    });

    // Window resize event listener
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}

// Function to convert mouse position to Three.js world coordinates
function getMousePositionInScene(event, renderer, camera) {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
    return vector;
}

function drawArm(endEffectorX, endEffectorY, preferredRotation, root, segmentLength, armPivot, handPivot) {
    // Calculate direction from the root (arm pivot) to the mouse
    let dirx = endEffectorX - root.x;
    let diry = endEffectorY - root.y;
    const len = Math.sqrt(dirx * dirx + diry * diry);

    // Normalize the direction
    dirx /= len;
    diry /= len;

    // Calculate the pole vector for the arm
    let poleVectorX = root.x + (dirx * len) / 2;
    let poleVectorY = root.y + (diry * len) / 2;

    // Calculate any rotation correction needed
    let disc = Math.sqrt(segmentLength * segmentLength - (len * len) / 4);
    if (preferredRotation < 0) disc = -disc;

    poleVectorX -= diry * disc;
    poleVectorY += dirx * disc;

    // Correct the hand position using local coordinates
    armPivot.position.set(poleVectorY, 0, poleVectorX);
    armPivot.updateMatrixWorld(); // Ensure the changes apply globally

    // Move the hand to the end effector position
    handPivot.position.set(endEffectorY, 0, endEffectorX);
    handPivot.updateMatrixWorld();
}

// Function to simulate inverse kinematics with 2D movement
function drawArm1(endEffectorX, endEffectorY, preferredRotation, root, segmentLength, armPivot, handPivot) {
    // Calculate direction from root to the mouse (end effector)
    let dirx = endEffectorX - root.x;
    let diry = endEffectorY - root.y;
    const len = Math.sqrt(dirx * dirx + diry * diry);
    dirx /= len;
    diry /= len;

    let poleVectorX, poleVectorY;
    let disc = segmentLength * segmentLength - (len * len) / 4;

    if (disc < 0) {
        // Fully extend the arm if the mouse is out of range
        poleVectorX = root.x + dirx * segmentLength;
        poleVectorY = root.y + diry * segmentLength;
        endEffectorX = root.x + dirx * segmentLength * 2;
        endEffectorY = root.y + diry * segmentLength * 2;
    } else {
        // Calculate pole vector for joint bending
        poleVectorX = root.x + (dirx * len) / 2;
        poleVectorY = root.y + (diry * len) / 2;
        disc = Math.sqrt(disc);
        if (preferredRotation < 0) disc = -disc;

        poleVectorX -= diry * disc;
        poleVectorY += dirx * disc;
    }

    // Update the arm pivot to follow the calculated pole vector
    armPivot.position.set(poleVectorX, poleVectorY, 0);
    armPivot.updateMatrixWorld();

    // Move the hand pivot to the end effector position
    handPivot.position.set(endEffectorX, endEffectorY, 0);
    handPivot.updateMatrixWorld();
}