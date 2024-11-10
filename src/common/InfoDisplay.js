import * as THREE from 'three';

export function displayMouseCoordinates(x, y) {
    const coordinatesElement = document.getElementById('mouse-coordinates');
    coordinatesElement.textContent = `RMP x: ${x.toFixed(3)}, y: ${y.toFixed(3)}`;
}

export function displayProjectedMouseCoordinates(mousePos) {
    const coordinatesElement = document.getElementById('projectedMousePosition');
    coordinatesElement.textContent = `PMP x: ${mousePos.x.toFixed(3)}, y: ${mousePos.y.toFixed(3)}`;
}

export function displayTargetDistance(distance) {
    const distanceElement = document.getElementById('target-distance');
    distanceElement.textContent = `T_Distance: ${distance.toFixed(4)}`;
}

export function displayMouseAndEndPositions(mousePos, endPosition) {
    const distanceElement = document.getElementById('current-mouse-position');
    distanceElement.textContent = `Mouse Pos: x: ${mousePos.x.toFixed(3)}, y: ${mousePos.y.toFixed(3)}`;

    const distanceElement2 = document.getElementById('current-endEffector-position');
    distanceElement2.textContent = `End Eff Pos: x: ${endPosition.x.toFixed(3)}, y: ${endPosition.y.toFixed(3)}`;
}

export function displayPivotPositions(armPivot, handPivot) {
    armPivot.updateMatrixWorld();
    handPivot.updateMatrixWorld();
    
    // Get world positions
    const armPivotPosition = new THREE.Vector3();
    const handPivotPosition = new THREE.Vector3();
    
    armPivot.getWorldPosition(armPivotPosition);
    handPivot.getWorldPosition(handPivotPosition);

    const distanceElement = document.getElementById('pivot-positions');
    distanceElement.textContent = `Arm Pivot @: x: ${armPivotPosition.x.toFixed(3)}, y(z): ${armPivotPosition.y.toFixed(3)}
    Hand Pivot @: x: ${handPivotPosition.x.toFixed(3)}, y(z): ${handPivotPosition.y.toFixed(3)}`;
}