import * as THREE from 'three';

import {
    mousePosition,
    armToEndDistance,
    armToHandDistance,
    handToEndDistance
} from './EventHandlers.js';

export function applyInverseKinematics(customMousePosition, targetDistance, armPivot, handPivot, body) {
    //console.log('Initial state of body:', body);
    const armAngle = calculateAngleWithCosineRule(armToHandDistance, targetDistance, handToEndDistance);
    const handAngle = calculateAngleWithCosineRule(handToEndDistance, armToHandDistance, targetDistance);

    let bodyAngle = body.getYRotation();

    const offsetArmAngle = getOffsetAngleForArmPivot(customMousePosition, armPivot);
    const totalArmAngle = armAngle + offsetArmAngle + Math.PI / 2 - bodyAngle;
    const totalHandAngle = handAngle - Math.PI; // + Math.PI // + (3 * Math.PI / 4);

    //const totalHandAngle = handAngle + armAngle + Math.PI;

    displayAngle(totalArmAngle, totalHandAngle, bodyAngle);

    armPivot.rotation.y = totalArmAngle;
    handPivot.rotation.y = totalHandAngle;
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

export function displayAngle(armAngle, handAngle, bodyAngle) {
    const distanceElement = document.getElementById('angle-values');
    distanceElement.textContent = `Arm: ${armAngle.toFixed(3)}, 
    Hand: ${handAngle.toFixed(3)}, Body: ${bodyAngle.toFixed(3)}`;
}


