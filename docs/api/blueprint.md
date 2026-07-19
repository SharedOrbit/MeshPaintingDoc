# Blueprint API

This page lists the main Blueprint-facing entry points used by runtime painting workflows.

## RuntimeMeshPaintTargetComponent

| Function | Purpose |
| --- | --- |
| `InitializeRuntimePaintTarget` | Prepares render targets and material instances. |
| `ApplyRuntimePaintTexturesToTargetMesh` | Applies paint textures to target materials. |
| `PaintAtHitWithSettings` | Paints at a supplied hit result. |
| `PaintUnderCursorWithSettings` | Traces under the cursor and paints the resolved target. |
| `SamplePaintedSurfaceColor` | Samples color for the picker/eyedropper workflow. |

## PaintingModeControllerComponent

| Function | Purpose |
| --- | --- |
| `EnterPaintingMode` | Enters paint mode. |
| `ExitPaintingMode` | Leaves paint mode. |
| `SetBrushSize` | Updates the active brush size. |
| `ApplyBrushMaterialSettings` | Pushes active brush settings to the target. |
| `SamplePaintedSurfaceColor` | Samples the current cursor target. |

## Common Brush Data

Typical brush settings include:

- Color
- Brush size
- Opacity
- Hardness
- Metallic
- Roughness
- Eraser mode

## Notes

Blueprint API names may vary slightly depending on your exact plugin version. Use this page as the workflow reference and check the component details panel or Blueprint action search for the exact callable names.
