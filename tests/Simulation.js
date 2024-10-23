/*
This file contains a simple test that simulates a sequence of key presses. The
runTestSequence function is called after a delay to simulate pressing certain keys.
The test is run by adding a load event listener to the window object that calls the function. This is done by uncommenting the relevant code inside the main.js file.
*/
// Helper function to simulate key events
function simulateKeyEvent(key, eventType = 'keydown') {
    const event = new KeyboardEvent(eventType, { key });
    document.dispatchEvent(event);
}

// Simulate a sequence of key presses (up, down, left, right)
export function runTestSequence() {
    console.log('Running test sequence...');

    // Simulate pressing 'ArrowUp', 'ArrowDown', 'h', and 'k'
    simulateKeyEvent('ArrowUp');
    setTimeout(() => simulateKeyEvent('ArrowDown'), 500);
    setTimeout(() => simulateKeyEvent('h'), 1000);
    setTimeout(() => simulateKeyEvent('k'), 1500);

    // Simulate releasing the keys
    setTimeout(() => simulateKeyEvent('ArrowUp', 'keyup'), 2000);
    setTimeout(() => simulateKeyEvent('ArrowDown', 'keyup'), 2500);
    setTimeout(() => simulateKeyEvent('h', 'keyup'), 3000);
    setTimeout(() => simulateKeyEvent('k', 'keyup'), 3500);
}

export function runProlongedTestSequence() {
    console.log('Running test sequence...');

    // Helper function to delay the simulation of key events
    function pressKey(key, delay) {
        setTimeout(() => simulateKeyEvent(key), delay);
        setTimeout(() => simulateKeyEvent(key, 'keyup'), delay + 1000); // Release after 100ms
    }

    let delay = 0;

    // Part 1: Move body along all axes
    pressKey('ArrowUp', delay += 0);
    pressKey('ArrowRight', delay += 500);
    pressKey('ArrowDown', delay += 500);
    pressKey('ArrowLeft', delay += 500);
    pressKey('.', delay += 500);  // Move forward along Z-axis
    pressKey(',', delay += 500);  // Move backward along Z-axis

    // Part 2: Rotate body on all axes
    pressKey('w', delay += 500);  // Rotate forward
    pressKey('s', delay += 500);  // Rotate backward
    pressKey('a', delay += 500);  // Rotate left
    pressKey('d', delay += 500);  // Rotate right

    pressKey('j', delay += 500);  // Rotate hand anticlockwise
    pressKey('k', delay += 500);  // Rotate hand clockwise

    // Part 5: Complex movement (body + arm + hand together)
    pressKey('ArrowUp', delay += 500); 
    pressKey('h', delay += 100);  // Move arm while body moves up
    pressKey('j', delay += 100);  // Move hand simultaneously
    pressKey('ArrowDown', delay += 500);
    pressKey('l', delay += 100);
    pressKey('k', delay += 100);

    // Part 3: Rotate arm pivot in both directions
    pressKey('h', delay += 500);  // Rotate arm anticlockwise
    pressKey('l', delay += 500);  // Rotate arm clockwise

    // Part 4: Rotate hand pivot in both directions
    pressKey('j', delay += 500);  // Rotate hand anticlockwise
    pressKey('k', delay += 500);  // Rotate hand clockwise

    // Part 5: Complex movement (body + arm + hand together)
    pressKey('ArrowUp', delay += 500); 
    pressKey('h', delay += 100);  // Move arm while body moves up
    pressKey('j', delay += 100);  // Move hand simultaneously
    pressKey('ArrowDown', delay += 500);
    pressKey('l', delay += 100);
    pressKey('k', delay += 100);

    pressKey('ArrowUp', delay += 0);
    pressKey('ArrowRight', delay += 500);
    pressKey('ArrowDown', delay += 500);
    pressKey('ArrowLeft', delay += 500);
    pressKey('.', delay += 500);  // Move forward along Z-axis
    pressKey(',', delay += 500);  // Move backward along Z-axis

    // Part 2: Rotate body on all axes
    pressKey('w', delay += 500);  // Rotate forward
    pressKey('s', delay += 500);  // Rotate backward
    pressKey('a', delay += 500);  // Rotate left
    pressKey('d', delay += 500);  // Rotate right

    // Part 6: Reverse the animation back to the center
    pressKey('k', delay += 500);  // Reverse hand movement
    pressKey('j', delay += 100);  
    pressKey('l', delay += 500);  // Reverse arm movement
    pressKey('h', delay += 100);
    pressKey('ArrowLeft', delay += 500);  // Move body back along X
    pressKey('ArrowRight', delay += 100);  
    pressKey(',', delay += 500);  // Move body back along Z

    // Final: Reset everything to the center smoothly
    setTimeout(() => simulateKeyEvent('x'), delay += 1000); // Press 'x' to reset all positions
}