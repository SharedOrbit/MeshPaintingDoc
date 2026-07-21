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

## Events

`PaintingModeControllerComponent` exposes player-side events for paint mode, input state, orbit state, and brush size changes.

| Event | When It Fires | Typical Use |
| --- | --- | --- |
| `OnPaintingModeEntered` | After `EnterPaintingMode` succeeds and the controller switches into painting mode. | Open custom UI, change HUD state, or enable paint-only gameplay logic. |
| `OnPaintingModeExited` | After `ExitPaintingMode` restores the previous camera and input state. | Close custom UI, return HUD state, or stop paint-only effects. |
| `OnPaintPressed` | When the paint input starts and the stroke begins. | Start stroke UI feedback or one-time effects for the beginning of a stroke. |
| `OnPaintTriggered` | While the paint input is being triggered. This can fire repeatedly during a stroke. | Lightweight per-stroke feedback only. Avoid expensive Blueprint work here. |
| `OnPaintReleased` | When painting stops and the current stroke is flushed. | End stroke UI feedback or commit local state after the stroke. |
| `OnBrushSizeChanged` | After `SetBrushSize` changes the clamped brush size. | Update brush size sliders, labels, or preview UI. |
| `OnOrbitStarted` | When orbit input starts in a mode where orbit is allowed. | Hide conflicting UI or show camera-control feedback. |
| `OnOrbitStopped` | When orbit input ends. | Restore UI that was hidden during orbit. |

## Common Functions

| Function | Use |
| --- | --- |
| `EnterPaintingMode` | Enables paint mode. |
| `ExitPaintingMode` | Leaves paint mode and restores camera/input state. |
| `ApplyPaint` | Applies paint for the current input state. |
| `SetBrushSize` | Updates brush size and UI state. |
| `ApplyBrushMaterialSettings` | Applies current material settings to the active target. |
| `SamplePaintedSurfaceColor` | Samples a color under the cursor. |
