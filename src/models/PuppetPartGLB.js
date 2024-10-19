import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

export class PuppetPartGLB {
    constructor(glbPath) {
        this.glbPath = glbPath;
        this.gltfLoader = new GLTFLoader();

        this.group = new THREE.Group();  // Group to act as the pivot point
        this.mesh = null;

        this.loadModel(() => {
            this.onReady(); // Trigger the callback when the model is ready
        });
    }

    loadModel(callback) {
        this.gltfLoader.load(
            this.glbPath,
            (gltf) => {
                this.mesh = gltf.scene;

                // Center the mesh within the group (if needed)
                this.mesh.position.set(0, 0, 0);

                // Add the mesh to the group (pivot)
                this.group.add(this.mesh);

                console.log('GLB model loaded successfully:', this.mesh);

                callback(); // Call the callback after the model is loaded
            },
            undefined,
            (error) => {
                console.error('Error loading the GLB model:', error);
            }
        );
    }

    onReady() {
    
    }

    addToScene(scene) {
        scene.add(this.group); // Add the group (pivot) to the scene
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z); // Adjust position of the group
    }

    setRotation(x, y, z) {
        this.group.rotation.set(x, y, z); // Adjust rotation of the group
    }

    move(x, y, z) {
        this.group.position.x += x;
        this.group.position.y += y;
        this.group.position.z += z;
    }

    rotate(x, y, z) {
        this.group.rotation.x += x;
        this.group.rotation.y += y;
        this.group.rotation.z += z;
    }

    onReady() {
        // This method can be overridden to execute code when the model is ready
        console.log('Model is ready');
    }
}