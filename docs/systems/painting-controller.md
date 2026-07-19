# Painting Controller

`PaintingModeControllerComponent` manages player-side painting.

It owns input handling, paint mode state, camera behavior, brush preview, color picker interaction, and multiplayer command submission.

## Control Modes

| Mode | Behavior |
| --- | --- |
| `CharacterLock` | Locks character movement and uses paint-mode camera behavior. |
| `Simple` | Provides simple paint input without driving character movement. |
| `None` | Disables paint-mode input handling. |

## Main Inputs

The plugin input mapping contains actions for:

- Paint
- Pick color
- Orbit camera
- Pan camera
- Camera zoom
- Brush size adjustment
- Toggle painting mode

Default mapping assets:

```text
/RuntimeMeshPainting/Input/IMC_PaintingMode
/RuntimeMeshPainting/Input/IMC_PaintingModeToggle
```

## Brush Settings

The controller can update:

- Color
- Brush size
- Opacity
- Hardness
- Metallic
- Roughness
- Eraser mode

These settings are passed into the target component during paint.

## Common Functions

| Function | Use |
| --- | --- |
| `EnterPaintingMode` | Enables paint mode. |
| `ExitPaintingMode` | Leaves paint mode and restores camera/input state. |
| `ApplyPaint` | Applies paint for the current input state. |
| `SetBrushSize` | Updates brush size and UI state. |
| `ApplyBrushMaterialSettings` | Applies current material settings to the active target. |
| `SamplePaintedSurfaceColor` | Samples a color under the cursor. |
