### Inverse Kinematics Logic

1. Find mouse position on screen.
2. Determine if this mouse position is within max radius
   1. If it is not, find the max position possible and return this
   2. If it is not, then just return
3. Take the value from 2 and calculate the distance between the shoulder joint and this position
4. Use this value, together with the length of the arm and the hand
5. Once the 3 distances have been determined, use cosine rule to find armAngle and handAngle
6. **Apply the angle rotations at the arm, and the hand. (i.e. ArmPivot and HandPivot)**
7. Put this whole thing in a loop upon mouse movement.
