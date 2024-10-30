import * as THREE from 'three';

import {
    mousePosition,
    armToEndDistance,
    armToHandDistance,
    handToEndDistance
} from './EventHandlers.js';

export function applyInverseKinematics(customMousePosition, targetDistance, armPivot, handPivot) {
    const armAngle = calculateAngleWithCosineRule(armToHandDistance, targetDistance, handToEndDistance);
    const handAngle = calculateAngleWithCosineRule(handToEndDistance, armToHandDistance, targetDistance);

    displayAngle(armAngle, handAngle);

    const offsetArmAngle = getOffsetAngleForArmPivot(customMousePosition, armPivot);
    const totalArmAngle = armAngle + offsetArmAngle + Math.PI / 2;
    const totalHandAngle = handAngle;

    armPivot.rotation.y = totalArmAngle;
    //handPivot.rotation.y = -totalHandAngle;
}

export function calculateAngleWithCosineRule(leftA, rightB, oppositeC) {
    // Ensure distances are valid
    const numerator = Math.pow(leftA, 2) + Math.pow(rightB, 2) - Math.pow(oppositeC, 2);
    const denominator = 2 * leftA * rightB;

    // Handle potential precision issues
    let cosAngleFraction = numerator / denominator;

    // Clamp the value to avoid NaN errors due to floating-point precision
    cosAngleFraction = Math.min(1, Math.max(-1, cosAngleFraction));

    const angle = Math.acos(cosAngleFraction); // Angle in radians

    var currentLogs = 10;
    if (currentLogs < 100) {
        //console.log('Numerator:', numerator, 'Denominator:', denominator, 'Cosine:', cosAngleFraction, 'Angle (radians):', angle);
        //currentLogs++;
    }  

    return angle;
}

export function getOffsetAngleForArmPivot(targetPosition, armPivot) {
    const armPivotPosition = new THREE.Vector3();
    armPivot.getWorldPosition(armPivotPosition);

    // Calculate the vector from the arm pivot to the target position
    targetPosition = new THREE.Vector3().subVectors(targetPosition, armPivotPosition);

    const angle = Math.atan2(targetPosition.y, targetPosition.x);
    return angle
}


export function displayAngle(armAngle, handAngle) {
    const distanceElement = document.getElementById('angle-values');
    distanceElement.textContent = `Arm: ${armAngle.toFixed(3)}, Hand: ${handAngle.toFixed(3)}`;
}



/*
export function calculateAngleWithCosineRuleOld(leftA, rightB, oppositeC) {
    const numerator = Math.pow(leftA, 2) + Math.pow(rightB, 2) - Math.pow(oppositeC, 2);
    const denominator = 2 * leftA * rightB;
    const cosAngleFraction = numerator / denominator;
    const cosAngle = Math.acos(cosAngleFraction);
    console.log(numerator, denominator, cosAngleFraction, cosAngle);
    return cosAngle;
}

export function applyInverseKinematicsOld(targetPosition, armPivot, handPivot) {
    
    const handPosition = new THREE.Vector3();
    handPivot.getWorldPosition(handPosition);

    var handToTargetDistance = handPosition.distanceTo(targetPosition);

    // Use the sine rule to calculate the angles at the pivots
    const angleArmPivot = calculateAngle(
        armToHandDistance,
        armToEndDistance,
        handToTargetDistance
    );

    const angleHandPivot = calculateAngle(
        handToTargetDistance,
        armToHandDistance,
        armToEndDistance
    );

    // Apply the calculated angles as rotations to the pivots
    if (angleArmPivot >= 1.5 || angleArmPivot < -1.5) {
    armPivot.rotation.y += angleArmPivot; // Apply arm pivot rotation
    }

    if (angleHandPivot >= 1.5 || angleHandPivot < -1.5) {
        handPivot.rotation.y += angleHandPivot; // Apply hand pivot rotation
    }
}

/**
 * Function to calculate the angle using the sine rule
 * @param {number} oppositeSide - Length of the side opposite to the desired angle.
 * @param {number} adjacentSide1 - Length of the first adjacent side.
 * @param {number} adjacentSide2 - Length of the second adjacent side.
 * @returns {number} - The calculated angle in radians.
 */
/*
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
/*
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
}*/