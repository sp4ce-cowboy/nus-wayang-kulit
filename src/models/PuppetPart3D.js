import * as THREE from 'three';
import { OBJLoader } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';

export class PuppetPart3D {
    constructor(objPath, mtlPath) {
        this.objPath = objPath;
        this.mtlPath = mtlPath;
        this.mtlLoader = new MTLLoader();
        this.objLoader = new OBJLoader();

        this.group = new THREE.Group();  // Group to act as the pivot point
        this.mesh = null;

        this.loadModel(() => {
            this.onReady(); // Trigger the callback when model is ready
        });
    }

    loadModel(callback) {
        this.mtlLoader.load(
            this.mtlPath,
            (materials) => {
                materials.preload();
                this.objLoader.setMaterials(materials);

                this.objLoader.load(
                    this.objPath,
                    (object) => {
                        this.mesh = object;

                        // Center the mesh within the group
                        this.mesh.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);

                        // Add the mesh to the group (pivot)
                        this.group.add(this.mesh);

                        callback(); // Call the callback after the model is loaded
                    },
                    undefined,
                    (error) => {
                        console.error('Error loading the OBJ model:', error);
                    }
                );
            },
            undefined,
            (error) => {
                console.error('Error loading the MTL file:', error);
            }
        );
    }

    addToScene(scene) {
        scene.add(this.group);  // Add the group (pivot) to the scene
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);  // Adjust position of the group
    }

    setRotation(x, y, z) {
        this.group.rotation.set(x, y, z);  // Adjust rotation of the group
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
}

/**
 * PuppetPart class to load and display 3D objects with materials.
 */
/*export class PuppetPart3D {
    constructor(objPath, mtlPath) {
        this.objPath = objPath;
        this.mtlPath = mtlPath;
        this.mtlLoader = new MTLLoader();
        this.objLoader = new OBJLoader();
        this.mesh = null;

        this.loadModel(() => {
            this.onReady(); // Trigger the callback when the model is ready
        });
    }

    loadModel(callback) {
        this.mtlLoader.load(
            this.mtlPath,
            (materials) => {
                materials.preload();
                this.objLoader.setMaterials(materials);
                
                this.objLoader.load(
                    this.objPath,
                    (object) => {
                        this.mesh = object;
                        callback(); // Call the callback after the model is loaded
                    },
                    undefined,
                    (error) => {
                        console.error('Error loading the OBJ model:', error);
                    }
                );
            },
            undefined,
            (error) => {
                console.error('Error loading the MTL file:', error);
            }
        );
    }

    onReady() {
        // This method can be overridden when the model is ready
    }

    addToScene(scene) {
        if (this.mesh) {
            scene.add(this.mesh);
        }
    }

    setPosition(x, y, z) {
        if (this.mesh) {
            this.mesh.position.set(x, y, z);
        }
    }

    setRotation(x, y, z) {
        if (this.mesh) {
            this.mesh.rotation.set(x, y, z);
        }
    }

    move(x, y, z) {
        if (this.mesh) {
            this.mesh.position.x += x;
            this.mesh.position.y += y;
            this.mesh.position.z += z;
        }
    }

    rotate(x, y, z) {
        if (this.mesh) {
            this.mesh.rotation.x += x;
            this.mesh.rotation.y += y;
            this.mesh.rotation.z += z;
        }
    }
}
*/