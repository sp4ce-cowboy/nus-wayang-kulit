import * as THREE from 'three';
import './style.css';

// Create a scene
const scene = new THREE.Scene();

// Load the texture (your image)
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('arm.png');

// Create a plane geometry (rectangle)
const geometry = new THREE.BoxGeometry(19.7, 39.6, 0.5); 
const material = new THREE.MeshBasicMaterial({ map: texture }); // Apply the texture to the material

// mesh is the visible object that is created by combining the geometry and material together
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Set initial position
mesh.position.set(0, 0, 0);

//Size of window
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Create a camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 50;

scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

// Movement limits
const limits = {
    x: { min: -10, max: 10 },
    y: { min: -5, max: 5 },
    z: { min: -20, max: 0 },
};

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft': // Left arrow key
            event.preventDefault(); // Prevent default behavior (scrolling)
            mesh.position.x = Math.max(limits.x.min, mesh.position.x - 1);
            break;
        case 'ArrowRight': // Right arrow key
            event.preventDefault(); // Prevent default behavior (scrolling)
            mesh.position.x = Math.min(limits.x.max, mesh.position.x + 1);
            break;
        case 'ArrowUp': // Up arrow key
            event.preventDefault(); // Prevent default behavior (scrolling)
            mesh.position.y = Math.min(limits.y.max, mesh.position.y + 1);
            break;
        case 'ArrowDown': // Down arrow key
            event.preventDefault(); // Prevent default behavior (scrolling)
            mesh.position.y = Math.max(limits.y.min, mesh.position.y - 1);
            break;
        case '.': 
            event.preventDefault();
            mesh.position.z = Math.max(limits.z.min, mesh.position.z + 1);
            break;
        case ',':
            event.preventDefault();
            mesh.position.z = Math.min(limits.z.max, mesh.position.z - 1);
            break;
        case 'a': // 'a' key rotates left
            mesh.rotation.z += 0.1;
            break;
        case 'd': // 'd' key rotates right
            mesh.rotation.z -= 0.1;
            break;
        case 'w': // 'w' key rotates cw on y axis
            mesh.rotation.y += 0.1;
            break;
        case 's': // 'd' key rotates acw on y axis
            mesh.rotation.y -= 0.1;
            break;
        case 'q': // 'q' key resets position
            mesh.position.set(0, 0, 0);
            mesh.rotation.set(0, 0, 0); // Also reset rotation
            break;
    }
});

//Resize Listener
window.addEventListener('resize', () => {
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();