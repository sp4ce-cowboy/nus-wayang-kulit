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