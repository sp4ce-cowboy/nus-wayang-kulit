# Log File
This file is a collation of all the work done individually.

## Week 1
- Familiarised with tech stack (Node, npm, 3js)
- Set up organisation and repository
- Discussed to use forking workflow
- Set up a sample project of an orbiting cube with spot and ambient lighting

### Challenges
- Figured out difference between standardmesh and basicmesh (standardmesh requires lighting)

## Week 2
- Organised code in an OOP manner
- Attempted to create 3d models on blender
- Created demo models on 3js with cube geometries and implemented key listeners to move model
- Formulated a JSON schema for standardising coordinate and dimention information for each puppetpart
  
### Challengs
- Allighning coordinates of each puppet part
- Creating a proper 3d model

### Looking Forward
Namely 2 approaches
1. Create multiple 3d models for each part and stitch them together in 3.js / cannon.js
2. Create on 3d model for the whole pupper and stitch them in blender / solidworks, then augment the model in 3.js / cannon.js

	> We plan to do so with simple placeholder models (3d oval/circle planes)
Figure out the challenges and implementation of these 2 approached and document findings and rationale of decision

## Week 3/4
From now on, we have identified 3 sections on this project that will benefit addressing as seperate concerns. Namely, they will be interface, 3D-modeling and Compter Vision

### Interface
Progress
1. Cannon.JS prototype - 2 3d rectangular meshes pivoted on one 3d square mesh, with gravity implemented
2. Forked a 3D model arm that solves inverse kinematics problems - perfectly alligning with our project's objectives


Challenges
1. 3d model overlap on cannon.js prototype - Found that cannon.js may not be the best approach to our physics implementation due to its heavy emphasis on collision physics. We felt that this real-world collision physics may actually pose a challenge instead as it may overcomplicate interactions of the puppet while it is actually realively straightforward (especially since three.js can solve inverse kinematics problems)
2. The inverse kinematics solver does not include forces of gravity that we might require with respect to the physics of the puppet

Looking Forward:
1. Figure out if there are work-arounds to the gravity implementation for the puppet. Otherwise, try to implement gravity with 3js that will be compatible with the inverse kinematics (for the middle pivot of the arm)
2. Find workarounds to avoild collisions / collision physics in cannon.js
   
### 3D-Modelling
Progress:
1. 3D-Modelling - retreived a plane of vertices that map the body, with vertices to represent gaps in the middle of the puppet as well

Challenges
1. To convert the 2d vertices to a 3d model(via extrusion), the vertices' normals do not allign and cause the 3d model to extrude in unpredictable manner
2. Fine 3D details of the puppet is unlikely to be mapped correctly on a 3D model

Looking Forward:
1. We can look into modelling the 3D model with another method

### Computer Vision

