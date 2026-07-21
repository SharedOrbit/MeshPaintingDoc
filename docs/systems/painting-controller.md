# PaintingModeControllerComponent

`PaintingModeControllerComponent` is the player-side controller for runtime painting.

It does not make a mesh paintable by itself. Paintable meshes still need a `RuntimeMeshPaintTargetComponent`. The controller is responsible for entering paint mode, reading player input, showing the color picker, drawing the brush preview, resolving the target under the cursor, and submitting paint commands.

![PaintingModeControllerComponent added to a character](/painting-controller/01-add-component.png)

## What It Does

The controller handles the player-side part of the painting workflow:

- Enters and exits painting mode.
- Adds the paint input mapping contexts.
- Traces from the mouse position into the world.
- Finds the correct `RuntimeMeshPaintTargetComponent`.
- Applies the current brush settings.
- Shows the runtime color picker widget.
- Displays the brush cursor and brush area preview.
- Controls paint-mode orbit, pan, zoom, and movement behavior.
- Sends multiplayer paint commands when the target has replication enabled.

## Required Setup

Add `PaintingModeControllerComponent` to the locally controlled player actor that should paint.

For a normal third-person character, add it to the character blueprint. For a drone or custom pawn, add it to the pawn that owns the camera input. A `PlayerController` owner is also supported for simple setups.

`CharacterLock` mode expects the owner to be a character with:

- `CharacterMovement`
- `Camera`
- `SpringArm`

Use `Simple` mode when the owner is not a standard character or when you do not want the component to lock character movement.

## Control Mode and Input

The `Controls` and `Input` sections define how the component receives paint input.

![Control mode and input assets](/painting-controller/02-controls-input.png)

| Setting | Purpose |
| --- | --- |
| `Control Mode` | Selects how much player/camera behavior the component controls. |
| `Painting Input Mapping Context` | Mapping context added while paint mode is active. |
| `Painting Toggle Input Mapping Context` | Mapping context used for toggling paint mode. |
| `Painting Input Priority` | Enhanced Input priority used when mapping contexts are added. |
| `Load Default Input Assets` | Loads the plugin default input actions and mapping contexts when fields are empty. |

Control modes:

| Mode | Behavior |
| --- | --- |
| `Character Lock` | Locks normal character look behavior, shows the mouse cursor, applies paint-mode movement/camera behavior, then restores the previous state when paint mode exits. |
| `Simple` | Uses painting input without requiring a character movement setup. This is the safer mode for drone pawns, custom pawns, tools, and non-character controllers. |
| `None` | Disables the component's paint-mode input handling. Use this when you want to drive the component only from your own Blueprint or C++ code. |

Default input assets:

| Asset | Used For |
| --- | --- |
| `IA_Paint` | Starts, continues, and releases a paint stroke. |
| `IA_PickColorAction` | Samples the color under the cursor. |
| `IA_OrbitCamera` | Starts camera orbit while paint mode is active. |
| `IA_PanCamera` | Starts camera pan. The component only accepts pan while Shift is held. |
| `IA_CameraZoom` | Zooms the spring arm in `CharacterLock` mode. |
| `IA_AdjustBrushSize` | Adjusts brush size while the action is held and mouse delta is received. |
| `IA_AdjustBrushSizeWheel` | Adjusts brush size from mouse wheel while Control is held. |
| `IA_MouseDelta` | Feeds orbit, pan, and drag-based brush size changes. |
| `IA_PaintingMove` | Moves the locked character in `CharacterLock` mode. |
| `IA_TogglePaintingMode` | Toggles paint mode through the toggle mapping context. |

The exact keys are controlled by the input mapping assets. Edit `IMC_PaintingMode` or `IMC_PaintingModeToggle` if your project needs different bindings.

## Paint Target and Trace

The `Paint Target` section controls which paint target components this player is allowed to use. The `Paint` section controls trace and brush material setup.

![Paint target and trace settings](/painting-controller/06-target-paint.png)

| Setting | Purpose |
| --- | --- |
| `Auto Register` | If enabled, the controller can automatically use a single `RuntimeMeshPaintTargetComponent` found on its owner actor. |
| `Paint Target Components` | Optional allow list. When this array has entries, the controller can only paint those target components. |
| `Paint Brush Material` | Brush material used when submitting paint to the target. The default plugin brush material is usually enough. |
| `Paint Trace Channel` | Collision channel used for finding the surface under the cursor. The target mesh must block this channel. |
| `Paint Trace Complex` | Enables complex trace data for more accurate hit information. |

Leave `Paint Target Components` empty if the player should be able to paint any valid target hit under the cursor. Fill it only when the player must be restricted to specific paint targets.

## Brush Settings

Brush settings are stored on the controller and sent to the target when paint is applied.

![Brush settings](/painting-controller/08-brush-settings.png)

| Setting | Purpose |
| --- | --- |
| `Brush Size` | Current brush size used for paint and preview. |
| `Brush Color` | Current paint color. |
| `Min Brush Size` | Lower clamp used by `SetBrushSize` and brush-size input. |
| `Max Brush Size` | Upper clamp used by `SetBrushSize` and brush-size input. |
| `Brush Size Sensitivity` | Drag-based brush size change speed. |
| `Brush Size Wheel Sensitivity` | Mouse wheel brush size change speed. |
| `Brush Metallic` | Metallic value written when material settings painting is enabled on the target. |
| `Brush Roughness` | Roughness value written when material settings painting is enabled on the target. |
| `Brush Erase` | Enables erase mode for the current brush settings. |

Use `SetBrushSize` when changing brush size from UI. It clamps the value and fires `OnBrushSizeChanged`, so sliders and labels can stay synchronized.

## Color Picker and Cursor

The widget section controls the automatic runtime color picker. The cursor section controls the custom brush cursor shown outside the UI.

![Widget and cursor settings](/painting-controller/03-widget-cursor.png)

| Setting | Purpose |
| --- | --- |
| `Auto Create Color Picker Widget` | Creates the color picker automatically when paint mode starts. |
| `Color Picker Widget Class` | Widget class used for the runtime color picker. The default is `WBP_RuntimeColorPicker`. |
| `Color Picker Widget ZOrder` | Viewport Z order for the color picker. |
| `Use Brush Cursor Outside UI` | Replaces the mouse cursor with the brush cursor when the cursor is not over the painting UI. |
| `Brush Cursor Texture` | Texture used for the custom cursor. |
| `Brush Cursor Hot Spot` | Normalized cursor hotspot. |

When color picking is active or the cursor is over the color picker panel, painting and brush preview are blocked so UI interaction does not accidentally paint the mesh.

### Custom Brush Cursor Texture

You can replace `Brush Cursor Texture` with your own `Texture2D`, but the texture must be readable by the runtime cursor builder.

Requirements for a custom cursor texture:

- Use a normal `Texture2D` asset.
- Enable `CPU Copy` on the texture asset so the cursor pixels can be read in packaged builds.
- Keep the background transparent.
- Keep the texture small and readable as a cursor, usually `64x64` or `128x128`.
- Set `Brush Cursor Hot Spot` to the point that should touch the painted surface.

The cursor color is generated from the current `Brush Color`. The system does not use a separate mask texture. Instead, it treats visible, saturated, colored pixels in the cursor texture as the replaceable accent area.

For best results:

- Make only the brush tip or paint area strongly colored.
- Keep the handle and outline grayscale, white, black, or low saturation if they should not change color.
- Do not make the tintable tip too dark, because the source brightness is preserved when the brush color is applied.
- Use alpha for clean cursor edges; nearly transparent pixels are ignored by the tint step.

The default `T_Brush` texture is already prepared this way: the painted tip is the dynamic color area, while the rest of the cursor stays stable.

![Runtime color picker](/painting-controller/10-runtime-color-picker.png)

## Brush Area Preview

The brush area preview draws the visible ring on top of the hit surface.

![Brush area preview settings](/painting-controller/04-brush-preview-settings.png)

| Setting | Purpose |
| --- | --- |
| `Enable Brush Area Preview` | Enables or disables the surface ring preview. |
| `Brush Area Preview Line Thickness` | Base line thickness. |
| `Brush Area Preview Thickness Brush Size Multiplier` | Adds thickness based on brush size. |
| `Brush Area Preview Color` | Preview line color. |
| `Brush Area Preview Emissive Intensity` | Brightness multiplier for the preview color. |
| `Brush Area Preview Surface Offset` | Small offset from the surface to avoid depth fighting. |
| `Brush Area Preview Segments` | Number of points used to draw the ring. |
| `Brush Area Preview Smoothing Speed` | Smooths preview movement across the surface. |

![Brush area preview in game](/painting-controller/05-brush-preview-runtime.png)

The preview follows the same paint target filtering and trace channel as painting. If the target cannot be resolved, the preview is hidden after a short grace period.

## Camera and Movement

Camera settings only affect the owner while paint mode is active. When paint mode exits, zoom and pan changes are restored smoothly.

![Camera, orbit, and movement settings](/painting-controller/07-camera-settings.png)

| Setting | Purpose |
| --- | --- |
| `Painting Movement Speed` | Movement speed used in `CharacterLock` mode. |
| `Orbit Yaw Sensitivity` | Horizontal orbit sensitivity. |
| `Orbit Pitch Sensitivity` | Vertical orbit sensitivity. |
| `Minimum Orbit Pitch` | Lower pitch clamp. |
| `Maximum Orbit Pitch` | Upper pitch clamp. |
| `Camera Zoom Sensitivity` | Spring arm zoom speed. |
| `Minimum Camera Zoom Distance` | Closest allowed zoom distance. |
| `Maximum Camera Zoom Distance` | Farthest configured zoom distance. The controller does not zoom farther than the pre-paint default position. |
| `Camera Pan Sensitivity` | Pan movement speed. |
| `Camera Pan Max Offset` | Maximum pan offset from the saved default position. `0` removes this clamp. |
| `Camera Restore Smoothing Speed` | Speed used when restoring zoom and pan after paint mode exits. |

Orbit and pan stop active painting before moving the camera. Brush size adjustment also stops painting so input states do not overlap.

## Events

The component exposes Blueprint events for paint mode and input state changes.

![PaintingModeControllerComponent events](/painting-controller/09-events.png)

| Event | When It Fires | Typical Use |
| --- | --- | --- |
| `OnPaintingModeEntered` | After paint mode successfully starts. | Open custom UI, update HUD state, or enable paint-only gameplay logic. |
| `OnPaintingModeExited` | After paint mode exits and previous input/camera state is restored. | Close custom UI or return the HUD to normal gameplay state. |
| `OnPaintPressed` | When the paint input starts a new stroke. | Start stroke feedback. |
| `OnPaintTriggered` | While the paint input continues. This can fire many times during one stroke. | Lightweight per-stroke feedback only. Avoid heavy Blueprint work here. |
| `OnPaintReleased` | When the current stroke ends. | End stroke feedback or commit UI state. |
| `OnBrushSizeChanged` | After `SetBrushSize` changes the clamped brush size. | Update brush size sliders, text, or preview UI. |
| `OnOrbitStarted` | When camera orbit starts. | Hide conflicting UI or show camera-control feedback. |
| `OnOrbitStopped` | When camera orbit stops. | Restore UI hidden during orbit. |
| `OnComponentActivated` | Standard Unreal component event. | Normal component activation logic only. |
| `OnComponentDeactivated` | Standard Unreal component event. | Normal component deactivation logic only. |

## Useful Blueprint Functions

| Function | Use |
| --- | --- |
| `EnterPaintingMode` | Starts paint mode, adds the painting mapping context, creates the widget, and shows the cursor. |
| `ExitPaintingMode` | Leaves paint mode, removes the mapping context/widget, stops input states, and restores camera/input state. |
| `SetBrushSize` | Changes brush size with min/max clamping and broadcasts `OnBrushSizeChanged`. |
| `SetBrushAreaPreviewEnabled` | Enables or disables the surface preview ring. |
| `SetPaintTargetComponent` | Restricts painting to one target component. |
| `SetPaintTargetComponents` | Restricts painting to a list of target components. |
| `AddPaintTargetComponent` | Adds one target component to the allow list. |
| `ClearPaintTargetComponents` | Clears the allow list so hit-based target discovery can be used again. |
| `GetBrushMaterialSettings` | Returns the current color, size, metallic, roughness, and erase state as brush settings. |
| `ApplyBrushMaterialSettings` | Applies external brush settings to the controller. |
| `SamplePaintedSurfaceColor` | Samples color through the resolved paint target. |
| `ApplyPaint` | Applies paint under the current cursor position. Normally called by input. |

## Multiplayer Behavior

The controller is the multiplayer submission point for player input.

When the target has `Replicate Runtime Paint` enabled, the controller applies local prediction first, then submits a compact paint command batch to the server. The target component validates and stores the authoritative paint history. Late join and replay details are covered in [Multiplayer](/systems/multiplayer).

## Common Mistakes

- `Control Mode` is set to `None`, so no paint input is added.
- `CharacterLock` is used on an actor that is not a character with camera, spring arm, and movement components.
- `Paint Target Components` contains the wrong target, so valid meshes under the cursor are ignored.
- The target mesh does not block the selected `Paint Trace Channel`.
- `Load Default Input Assets` is disabled but custom input actions or mapping contexts were not assigned.
- Heavy Blueprint logic is bound to `OnPaintTriggered`, causing hitches during continuous strokes.
- The cursor is over the color picker UI, so painting and preview are intentionally blocked.
