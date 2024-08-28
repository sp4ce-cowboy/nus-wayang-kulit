import * as THREE from 'three';

/**
 * - Loading Image Dimensions: The constructor loads the image and retrieves its
 * natural dimensions using an HTML Image object.
 * 
 * - Geometry Creation: Geometry is created only after the image dimensions are
 * loaded (or after the dimensions are manually provided).
 * 
 * - Default Scaling: The width and height are scaled down by dividing by 100 to fit
 * them better into the 3D scene.
 * 
 * - Manual Overrides: Can still pass in custom width and height values when creating
 * a PuppetPart to override the auto-determined dimensions.
    */
export class PuppetPart {
    constructor(imagePath, width = null, height = null, depth = 0.5) {
        this.textureLoader = new THREE.TextureLoader();
        this.imagePath = imagePath;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.texture = null;
        this.geometry = null;
        this.material = null;
        this.mesh = null;

        this.loadTextureAndSetGeometry(() => {
            this.onReady();  // Call the ready callback when the geometry is created
        });
    }

    
    loadTextureAndSetGeometry(callback) {
        this.textureLoader.load(this.imagePath, (texture) => {
            this.texture = texture;

            if (!this.width || !this.height) {
                const image = new Image();
                image.src = this.imagePath;
                image.onload = () => {
                    this.width = this.width || image.width / 100;  // Divide by 100 to scale down
                    this.height = this.height || image.height / 100;

                    this.createGeometry();
                    callback();  // Call the callback after the geometry is created
                };
            } else {
                this.createGeometry();
                callback();  // Call the callback immediately if dimensions are provided
            }
        });
    }

    createGeometry() {
        this.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        this.material = new THREE.MeshBasicMaterial({ map: this.texture });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

    }

    onReady() {
        // This method can be overridden or used to trigger when the geometry is ready
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