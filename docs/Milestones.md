# Latest Updates

### Overview

- Exported a sufficiently detailed 3d-model for the body, arm and hand
- Implement a PuppetPart3D class to abstract away the object model logic
    - Developed both a Part3D for `.obj/mtl` and PartGLB for `.gltf` format.
    - Created a python script to manually adjust obj files
- Attached all parts together in a fixed manner
  - Programmatic movements of hand body and arm without losing relative positioning
- Generalise the attachments into a json schema applicable to any puppet
- Implemented a way to use other puppets as well
  - Puppets can be input manually
  - New puppets can be configured to function the same by simply modifying the json schema
  - No programmatic change needs to be made. Both the object loaders and event handlers (for position reset) take this into account.
- Allow for 3 translations, 3 rotational degrees of freedom
  - 6 DOF is also applicable to arm and hand as defined "child" meshes
- Implemented clockwise and anti-clockwise (1 rotational DOF) for arm and hand
- Implemented asynchronous control scheme (key events) for all 8 DOF
  - Rotation of body: w,s + q,e + a,d
  - Translation of body: Arrow keys + , .
  - Rotation of arm: h, l (vim motions)
  - Rotation of hand: j, k (vim motions)
- Add a control panel to universally control behaviour of the web app
- Added Simulation capabilities
  - Added 3 test case scenarios where key events are simulated
  - Added an option to begin the app with simulated key events (control panel)

### Tasks Completed

#### Milestone 2

Milestone achieved when:

- All major puppet joints are correctly defined and positioned
- Each joint has a properly set axis of rotation
- The puppet's structure maintains integrity when individual parts are rotated
- A visual or programmatic test confirms all joints rotate as expected without breaking the model

First and second objectives are completed, can refer to the json docs and the schema for pivotPositioning. Using Three.Group() automatically defines the relative axis of motion. Can use the pivotHelper to visualise this as well. Third and fourth objectives also completed, simulation + key events. can demonstrate this

### Milestone 3

Milestone achieved when:
- The arms can be moved.
- The central axis of the puppet can be rotated.
- The puppet can be translated (moved) across the 2D plane of the canvas
- Keyboard controls are implemented and responsive:
- Basic simulated input can be processed:
    - Implement a simple function to process a sequence of movement commands programmatically (which will eventually come from a machine vision interface).
- Movements are smooth and maintain the puppet's 2D form (no 3D rotation yet)

All of the above are completed together with the objectives of milestone 2. Simlation Runner can be used to demonstrate the basic simulated input. Movements smoothness can be adjusted via the global Constants class. 

### Milestone 4

Milestone achieved when:
- The puppet can rotate around its vertical axis (y-axis) to reveal its back side 
- The rotation is smooth and maintains the puppet's flat nature during the turn 
- Both sides of the puppet (front and back) are correctly textured and visible* 
- The puppet can be viewed from any angle in 3D space while maintaining its characteristic flat form 
- User controls or programmatic functions allow for easy manipulation of the puppet's 3D orientation

First objective completed with a,d keys. Flat nature is visible during rotation. Both sides have the body.mtl applied, but the wayang kulit stick is visible on both sides as the .png image provided only captures one side. 2 separate images are required. The 8-DOF allows for the puppet to be viewed from any angle in space, and the maintenance of the flat form can be viewed. Last objective is also completed, both user controls and simulations allow for easy manipulation of the puppet's 3D orientation. The function for this is built into threejs so a separate function would not be required (but can be written anyway).

### Moving Forward
Some things to consider are:
- Inverse kinematics 
- A more refined 3d-model

From this point onwards, the interface is mostly completed and any further progress would most likely have to do with integrating with the ML side of things.


