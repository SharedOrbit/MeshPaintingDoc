# Quick Start

This page shows the shortest path from an empty actor to a paintable runtime mesh.

## 1. Add a Paint Target

Add `RuntimeMeshPaintTargetComponent` to the actor that owns the mesh you want to paint.

Then configure one of the target modes:

- Use `TargetMesh` for a single mesh component.
- Use `MeshTargets` when the actor has multiple paintable mesh components.

## 2. Initialize the Target

Call:

```text
InitializeRuntimePaintTarget
```

This creates the runtime render targets and binds them to the target mesh material instances.

## 3. Prepare the Material

Your mesh material should sample:

```text
PaintedColorTexture
PaintedMaterialSettingsTexture
```

The target component assigns these texture parameters at runtime.

## 4. Add the Paint Controller

Add `PaintingModeControllerComponent` to the player pawn or player controller side.

This component handles:

- Paint input
- Brush settings
- Color picker UI
- Brush preview
- Camera behavior
- Multiplayer paint command submission

## 5. Use the Plugin Input Mapping

Use the input mapping assets:

```text
/RuntimeMeshPainting/Input/IMC_PaintingMode
/RuntimeMeshPainting/Input/IMC_PaintingModeToggle
```

## 6. Enter Paint Mode

Call:

```text
EnterPaintingMode
```

The player can now paint the configured mesh target.

## Common First Test

Use a simple cube with non-overlapping UV islands and a material that displays `PaintedColorTexture`.

After this works, test:

- A skeletal mesh
- A larger brush near UV seams
- Eraser mode
- Color picking
- Multiplayer replication
