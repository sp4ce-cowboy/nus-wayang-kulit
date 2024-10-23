## Assets Directory

### Overview

The assets directory contains all the information required for each puppet to be rendered properly. The files must be placed in accordance with the requirements herein specified to ensure that all the models load properly, and no path issues arise.

The `archived_assets` folder contains useful assets that do not correspond to any specific puppet.

### Folder Structure Example

puppet_01
├── images
│   ├── arm.png
│   ├── body.png
│   ├── hand.png
│   └── stick.png
├── models
│   ├── arm
│   │   ├── Image_0.jpg
│   │   ├── arm.mtl
│   │   ├── arm.obj
│   │   └── puppet_01_arm.png
│   ├── body
│   │   ├── Image_0.png
│   │   ├── body.mtl
│   │   └── body.obj
│   └── hand
│       ├── Image_0.jpg
│       ├── hand.mtl
│       ├── hand.obj
│       └── hand.png
└── puppet_01.json

### Folder Structure Explanation

Within the assets folder, all resources relevant to a particular puppet shall be constrainted to a folder called `puppet_XX` where XX is the id of the puppet, which is arbitrary and assigned sequentially for now.

Within the `puppet_XX` folder, there are 2 sub-directories which are `images` and `models`.

Inside `images` are the `png` files for each component of the puppet. Currently, these are the arm, hand, body, and optionally, the stick. They shall be titled simply as shown above.

Inside `models` are 3 more sub-directories, corresponding to the arm, body, and hand. Within those directories are all the files needed for their `.obj` rendering including all material files and image files associated with those materials. Make copies of image files wherever possible to the relevant folder, and ensure that within the `mtl` file, all image references are local and no absolute paths are used.

Inside each sub-folder within `models`, there minimally must be 2 files:

1. `part.obj`
2. `part.mtl`

These two files must be named exactly the same as their folders.

### JSON file Explanation

Within each `puppet_XX` folder, there is a `puppet_xx.json` file at the root level. This file dictates specific positioning constants that are dependent on the specfic 3d model used. When a new 3d-model is imported, this file needs to be adjusted firstly with the correct paths and names, and secondly with manual adjustments of the relevant positions and rotations.

```json
{
    "body": {
        "path": "./assets/puppet_01/models/body/body.obj",
        "material": "./assets/puppet_01/models/body/body.mtl",
        "scale": [1, 1, 1],
        "position": [0, 0, 0],
        "rotation": [1.7, 0, 0]
    },
    "arm": {
        "path": "./assets/puppet_01/models/arm/arm.obj",
        "material": "./assets/puppet_01/models/arm/arm.mtl",
        "scale": [0.07, 0.07, 0.05],
        "position": [0, 0, 0.05],
        "rotation": [-1.7, -1.7, -0.2],
        "pivotPosition": [-0.08, 0.01, -0.07],
        "pivotRotation": [0, 0, 0]
    },
    "hand": {
        "path": "./assets/puppet_01/models/hand/hand.obj",
        "material": "./assets/puppet_01/models/hand/hand.mtl",
        "scale": [0.08, 0.08, 0.07],
        "position": [-0.025, 0.01, 0.055],
        "rotation": [-1.7, -1.7, -0.2],
        "pivotPosition": [0, 0, 0.11],
        "pivotRotation": [0, 0, 0]
    },
    "limits": {
        "x": { "min": -10, "max": 10 },
        "y": { "min": -5, "max": 5 },
        "z": { "min": -50, "max": 35 }
    }
}
```
