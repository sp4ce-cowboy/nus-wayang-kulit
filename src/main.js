import * as THREE from 'three';
import './style.css';
import { PuppetPart3D } from './models/PuppetPart3D.js';  
import { PuppetPartGLB } from './models/PuppetPartGLB.js';  
import { setupEventListeners } from './common/EventHandlers.js';
import { GLTFLoader } from 'three-stdlib';

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333); // Dark grey background

// Add ambient light (general soft light)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color and intensity
scene.add(ambientLight);

// Add directional light (acts like sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 0, 10); // Position the light source
scene.add(directionalLight);

// add spotlight
// Update the spotlight color
const spotLight = new THREE.SpotLight(0xffffff, 1);  // Use white light
spotLight.position.set(0, 0, 5);  // Adjust position
scene.add(spotLight);

// Create the body part with OBJ and MTL files

const body = new PuppetPart3D(
    './assets/puppet_01/export.obj',
    './assets/puppet_01/export.mtl'
);


//Loading the GLB file
/*const body = new PuppetPartGLB(
    './assets/puppet_01/shadowPuppet.glb',
);*/


// When the model is ready, add it to the scene and set its position
body.onReady = () => {
    body.addToScene(scene);
    body.setPosition(0, 0, 0); // Set initial position
    //body.setPosition(-3, 4, 0); // Adjusted position
    //body.setRotation(1.7, 0, 0); // Adjusted rotation (in radians)


    const limits = {
        x: { min: -10, max: 10 },
        y: { min: -5, max: 5 },
        z: { min: -50, max: 35 },
    };

    setupEventListeners({ body, renderer, camera }, limits);
};

// Set up the camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 1);
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.outputEncoding = THREE.sRGBEncoding;
//renderer.toneMapping = THREE.ACESFilmicToneMapping;
//renderer.toneMappingExposure = 1;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();