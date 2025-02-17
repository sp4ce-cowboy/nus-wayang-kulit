import * as THREE from 'three';
import { OBJLoader } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';

/**
* PuppetPart class to load and display 3D objects with materials.
*/
export class PuppetPart3D {
    constructor(objPath, mtlPath, scaleFactorX = 1, scaleFactorY = 1, scaleFactorZ = 1) {
        this.objPath = objPath;
        this.mtlPath = mtlPath;
        this.mtlLoader = new MTLLoader();
        this.objLoader = new OBJLoader();
        this.scaleFactorX = scaleFactorX;
        this.scaleFactorY = scaleFactorY;
        this.scaleFactorZ = scaleFactorZ;
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
                        this.mesh.scale.set(this.scaleFactorX, this.scaleFactorY, this.scaleFactorZ);
                        
                        // Ensure the materials are properly applied to all child meshes
                        this.mesh.traverse((child) => {
                            if (child.isMesh) {
                                child.material = materials.materials[child.name] || child.material;
                                child.material.needsUpdate = true; // Force update
                            }
                        });
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
    
    addToParent(parent) {
        if (this.mesh) {
            parent.add(this.mesh);  // Add this mesh to the parent group
        }
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

    getYRotation() {
        if (this.mesh) {
            return this.mesh.rotation.y;
        } else {
            return 0
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