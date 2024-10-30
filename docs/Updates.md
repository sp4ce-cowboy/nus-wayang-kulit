# Latest Updates

### Overview

- Exported a sufficiently detailed 3d-model for the body, arm and hand
- Implement a PuppetPart3D class to abstract away the object model logic
  - Developed both a Part3D for `.obj/mtl` and PartGLB for `.gltf` format.
  - Created a python script to manually adjust obj files
- Attached all parts together in a fixed manner
  - Programmatic movements of hand, body and arm without losing relative positioning
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
