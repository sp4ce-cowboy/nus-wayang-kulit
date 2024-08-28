import * as THREE from 'three';
import './style.css';

// Create a scene
const scene = new THREE.Scene();

// Create a shape (spehere)
// const geometry = new THREE.SphereGeometry(3, 16, 16); // geometry is the shape of the object
const geometry = new THREE.BoxGeometry(3, 3, 3); // geometry is the shape of the object
const material = new THREE.MeshStandardMaterial({ color: 0x800080 }); // material is the color of the object

// Create axis labels
const axesHelper = new THREE.AxesHelper(100);

// mesh is the visible object that is created by combining the geometry and material together
const mesh = new THREE.Mesh(geometry, material); 
 
scene.add(mesh);
scene.add(axesHelper);

//Size of window
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Light
// PointLight(color, intensity, distance, decay)
// distance: distance of the light 
// decay: decay of the light
const pointlight = new THREE.PointLight(0xffffff, 500, 100);
const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);

// position(x, y, z)
// x: left(-) and right(+), y: down(-) and up(+), z: back(-) and front(+)
pointlight.position.set(0, 10, 10);
scene.add(pointlight);
scene.add(ambientlight);

// Create a camera
// PerspectiveCamera(fov, aspect, near, far)
// fov: field of view, aspect: aspect ratio, near: near clipping plane, far: far clipping plane
// near and far clipping plane are used to remove objects that are too close or too far from the camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
camera.position.x = 20;
camera.position.z = 20;
camera.position.y = 20;
camera.lookAt(mesh.position);


scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

//Resize Listener
window.addEventListener('resize', () => {
  //Update Sizes
  //console.log('resized');
  sizes.height = window.innerHeight
  sizes.width = window.innerWidth;

  //Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);

})

// Animate on keyboard input
function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();