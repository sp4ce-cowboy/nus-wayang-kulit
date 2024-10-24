import * as THREE from 'three';

import {
    mousePosition,
    armToEndDistance,
    armToHandDistance,
    handToEndDistance
} from './EventHandlers.js';

/**
 * Function to apply Inverse Kinematics (IK) to arm and hand pivots
 * @param {THREE.Vector3} targetPosition - Global coordinates of the target end effector position.
 * @param {THREE.Group} armPivot - The arm pivot group.
 * @param {THREE.Group} handPivot - The hand pivot group.
 */
export function applyInverseKinematics(targetPosition, armPivot, handPivot) {
    
    const handPosition = new THREE.Vector3();
    handPivot.getWorldPosition(handPosition);
    var handToTargetDistance = handPosition.distanceTo(targetPosition);

    // Use the sine rule to calculate the angles at the pivots
    const angleArmPivot = calculateAngle(
        armToHandDistance,
        armToEndDistance,
        handToTargeDistance
    );

    const angleHandPivot = calculateAngle(
        handToTargetDistance,
        armToHandDistance,
        armToEndDistance
    );

    // Apply the calculated angles as rotations to the pivots
    armPivot.rotation.y += angleArmPivot; // Apply arm pivot rotation
    handPivot.rotation.y += angleHandPivot; // Apply hand pivot rotation
}

/**
 * Function to calculate the angle using the sine rule
 * @param {number} oppositeSide - Length of the side opposite to the desired angle.
 * @param {number} adjacentSide1 - Length of the first adjacent side.
 * @param {number} adjacentSide2 - Length of the second adjacent side.
 * @returns {number} - The calculated angle in radians.
 */
function calculateAngle(oppositeSide, adjacentSide1, adjacentSide2) {
    // Use the cosine rule to ensure valid angles are computed
    const cosAngle = (
        Math.pow(adjacentSide1, 2) 
        + Math.pow(adjacentSide2, 2) 
        - Math.pow(oppositeSide, 2)) 
        / (2 * adjacentSide1 * adjacentSide2);

    // Clamp the result to avoid NaN from floating-point precision issues
    const clampedCosAngle = Math.max(-1, Math.min(1, cosAngle));

    // Calculate and return the angle in radians
    return Math.acos(clampedCosAngle);
}

/**
 * Function to calculate the maximum possible position for the end effector.
 * If the mouse position is within the reach, it returns the mouse position.
 * If the mouse is beyond the reach, it clamps the position to the max possible length.
 * 
 * @param {THREE.Vector3} mousePosition - The current global mouse position.
 * @param {THREE.Vector3} armPivotPosition - The global position of the arm pivot.
 * @param {number} maxLength - The total length of the arm (armToHand + handToEnd).
 * @returns {THREE.Vector3} - The clamped end effector position.
 */
function getMaxPossibleEndPosition(mousePosition, armPivotPosition, maxLength) {
    // Calculate the vector from the arm pivot to the mouse position
    const direction = new THREE.Vector3().subVectors(mousePosition, armPivotPosition);
    
    // Calculate the distance between the arm pivot and the mouse position
    const distance = direction.length();

    // If the mouse position is within the max length, return it as the end position
    if (distance <= maxLength) {
        return mousePosition.clone(); // No clamping needed
    }

    // Otherwise, clamp the direction vector to the max length
    direction.normalize().multiplyScalar(maxLength);

    // Calculate the clamped end effector position
    const clampedEndPosition = new THREE.Vector3().addVectors(armPivotPosition, direction);

    return clampedEndPosition;
}