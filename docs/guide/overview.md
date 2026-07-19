# Overview

Runtime Mesh Painting is an Unreal Engine plugin for painting static and skeletal meshes during gameplay.

The plugin renders paint into runtime render targets using a GPU brush path. The painted result can be used by your mesh materials through texture parameters, so the mesh keeps its original material workflow while receiving runtime color and material settings.

## What It Does

- Paints static mesh and skeletal mesh targets at runtime.
- Uses GPU render target painting instead of CPU texture editing.
- Supports brush size, color, opacity, hardness, metallic, roughness, and eraser mode.
- Clips large brushes to the hit UV island or surface to prevent unrelated UV islands from being painted.
- Includes runtime brush preview and color picker UI.
- Supports multiplayer by replicating compact paint commands instead of raw render target textures.
- Supports late join by replaying replicated paint command history.

## Main Runtime Components

| Component | Responsibility |
| --- | --- |
| `RuntimeMeshPaintTargetComponent` | Owns mesh targets, render targets, material binding, paint application, and replication history. |
| `PaintingModeControllerComponent` | Owns player input, camera behavior, color picker integration, brush settings, and paint command submission. |
| `RuntimeMeshPaintGPUBrushRenderer` | Applies brush commands to render targets through the GPU paint path. |

## Supported Platform

The plugin is currently tested on Windows:

```text
Win64
```

Other platforms should only be marked as supported after testing packaging, shader loading, input assets, and runtime render target behavior on those platforms.
