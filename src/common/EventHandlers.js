 //import './Constants.js';
import { INVERSE_MOTION_THRESHOLD,INVERSE_ROTATION_THRESHOLD, MOTION_THRESHOLD, ROTATION_THRESHOLD } from './Constants.js';
 
 /**
  * This file contains all the EventHandlers which include the event listeners for 
  * the keyboard and window resize events, and any other event listeners that 
  * may be needed in the future.
  */
 export function setupEventListeners(puppetParts, limits) {
    document.addEventListener('keydown', (event) => {
        const body = puppetParts.body;  // Body is the main puppet part

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                body.move(Math.max(limits.x.min, body.mesh.position.x - 1) - body.mesh.position.x, 0, 0);
                break;
            case 'ArrowRight':
                event.preventDefault();
                body.move(Math.min(limits.x.max, body.mesh.position.x + 1) - body.mesh.position.x, 0, 0);
                break;
            case 'ArrowUp':
                event.preventDefault();
                body.move(0, Math.min(limits.y.max, body.mesh.position.y + 1) - body.mesh.position.y, 0);
                break;
            case 'ArrowDown':
                event.preventDefault();
                body.move(0, Math.max(limits.y.min, body.mesh.position.y - 1) - body.mesh.position.y, 0);
                break;
            case '.':
                event.preventDefault();
                body.move(0, 0, Math.min(limits.z.max, body.mesh.position.z + 1) - body.mesh.position.z);
                break;
            case ',':
                event.preventDefault();
                body.move(0, 0, Math.max(limits.z.min, body.mesh.position.z - 1) - body.mesh.position.z);
                break;
            case 'a':
                body.rotate(0, 0, MOTION_THRESHOLD);
                break;
            case 'd':
                body.rotate(0, 0, INVERSE_MOTION_THRESHOLD);
                break;
            case 'w':
                body.rotate(0, ROTATION_THRESHOLD, 0);
                break;
            case 's':
                body.rotate(0, INVERSE_ROTATION_THRESHOLD, 0);
                break;
            case 'q':
                body.setPosition(0, 0, 0);
                body.setRotation(0, 0, 0);
                break;
        }
    });

    window.addEventListener('resize', () => {
        puppetParts.renderer.setSize(window.innerWidth, window.innerHeight);
        puppetParts.camera.aspect = window.innerWidth / window.innerHeight;
        puppetParts.camera.updateProjectionMatrix();
    });
}