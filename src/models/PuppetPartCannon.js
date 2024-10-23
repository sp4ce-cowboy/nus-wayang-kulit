import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OBJLoader } from 'three-stdlib';
import { MTLLoader } from 'three-stdlib';

/**
* PuppetPart3D class integrates 3D model loading with physics via Cannon.js.
*/
export class PuppetPart3D {
    constructor(objPath, mtlPath, scaleFactorX = 1,
        scaleFactorY = 1,
        scaleFactorZ = 1,
        physicsWorld,
        mass = 1) {
            this.objPath = objPath;
            this.mtlPath = mtlPath;
            this.mtlLoader = new MTLLoader();
            this.objLoader = new OBJLoader();
            
            this.scaleFactorX = scaleFactorX;
            this.scaleFactorY = scaleFactorY;
            this.scaleFactorZ = scaleFactorZ;
            
            this.mesh = null;        // Three.js mesh
            this.physicsBody = null; // Cannon.js physics body
            this.physicsWorld = physicsWorld; // Store reference to the world
            this.mass = mass; // Mass for physics simulation
            
            this.loadModel(() => {
                //this.createPhysicsBody(); 
                this.onReady(); // Trigger the callback when the model is ready
            });
        }
        
        // Load 3D model and apply materials
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
                                    child.material.needsUpdate = true;
                                }
                            });
                            
                            this.createPhysicsBody(); // Create the physics body after mesh is ready
                            callback(); // Notify that the model is ready
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
        
        
        // New function to create a physics body
        createPhysicsBody() {
            // Create a simple box shape for now (can adjust as needed)
            const shape = new CANNON.Box(new CANNON.Vec3(
                this.scaleFactorX / 2,
                this.scaleFactorY / 2,
                this.scaleFactorZ / 2
            ));
            
            // Create a rigid body using the shape
            this.physicsBody = new CANNON.Body({
                mass: this.mass, // Mass of the object
                shape: shape,
            });
            
            // Sync initial position with the mesh
            this.physicsBody.position.copy(this.mesh.position);
            this.physicsBody.quaternion.copy(this.mesh.quaternion);
            
            // Add the physics body to the world
            this.physicsWorld.addBody(this.physicsBody);
        }
        
        // Synchronize the mesh with the physics body (called every frame)
        syncWithPhysics() {
            if (this.physicsBody) {
                this.mesh.position.copy(this.physicsBody.position);
                this.mesh.quaternion.copy(this.physicsBody.quaternion);
            }
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
                if (this.physicsBody) {
                    this.physicsBody.position.set(x, y, z); // Sync physics body
                }
            }
        }
        
        setRotation(x, y, z) {
            if (this.mesh) {
                this.mesh.rotation.set(x, y, z);
                if (this.physicsBody) {
                    this.physicsBody.quaternion.setFromEuler(x, y, z); // Sync physics body
                }
            }
        }
        
        move(x, y, z) {
            if (this.mesh) {
                this.mesh.position.x += x;
                this.mesh.position.y += y;
                this.mesh.position.z += z;
                
                if (this.physicsBody) {
                    this.physicsBody.position.x += x;
                    this.physicsBody.position.y += y;
                    this.physicsBody.position.z += z;
                }
            }
        }
        
        rotate(x, y, z) {
            if (this.mesh) {
                this.mesh.rotation.x += x;
                this.mesh.rotation.y += y;
                this.mesh.rotation.z += z;
                
                if (this.physicsBody) {
                    const quaternion = new THREE.Quaternion();
                    quaternion.setFromEuler(new THREE.Euler(x, y, z));
                    this.physicsBody.quaternion.multiply(quaternion);
                }
            }
        }
    }