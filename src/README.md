## Main Directory

This directory contains the main source code for the project.

### File Structure

The project folder structure is as follows:

- `index.html` contains the base HTML file
- `main.js` contains the majority of the javascript code. Monolithic for now.

### Architecture

The web application used here will be built using vitejs as the development environment, and threejs for the 3D canvas. Cannonjs will be implemented at a later point when more precise physics-based animations are required.

The models to be designed:

- Canvas/Scene
- Renderer
- Puppet
- Bodypart

Classes:

- Main (The start point of the application)

### Positioning

**1. Coordinate System and Origin:**

- **Origin (0, 0, 0)** : The body of the puppet can be treated as the origin. All other parts will be positioned relative to the body.
- **Relative Positioning** : Each body part (e.g., arm, hand, stick) will have a relative position and rotation with respect to the part it’s connected to. For example, the arm’s position is relative to the body’s origin, the hand’s position is relative to the arm, and so on.

**2. Defining Connections:**

* **Hinge Points** : Each body part will have one or more hinge points that define where it connects to other parts. These hinge points can be defined as coordinates relative to the origin of the part.
* **Connection Information** : A JSON file can store the information about these hinge points, the part dimensions, and the rotation constraints.
