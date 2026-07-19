# Paint Target Component

`RuntimeMeshPaintTargetComponent` is the component that makes an actor paintable.

It owns the mesh targets, runtime render targets, material texture binding, local paint application, and multiplayer command history.

## Main Responsibilities

- Resolve paintable mesh components.
- Create runtime color and material settings render targets.
- Bind render targets to dynamic material instances.
- Resolve hit information into a paint command.
- Submit paint commands to the GPU brush renderer.
- Store replicated paint command history for multiplayer.

## Important Settings

| Setting | Purpose |
| --- | --- |
| `MeshTargets` | Named mesh components that can be painted. |
| `TargetMesh` | Single target mesh component fallback. |
| `RuntimeRenderTargetWidth` | Width of the paint render target. |
| `RuntimeRenderTargetHeight` | Height of the paint render target. |
| `RuntimeRenderTargetFormat` | Render target format used for paint textures. |
| `InitialPaintColor` | Initial color used when the render target is created. |
| `InitialMaterialSettingsColor` | Initial material settings texture color. |
| `UVChannel` | UV channel used for painting. |
| `bClipBrushToUVIsland` | Clips paint to the hit surface or UV island. |
| `UVIslandConnectionTolerance` | Tolerance used by island connection logic. |

## Common Functions

| Function | Use |
| --- | --- |
| `InitializeRuntimePaintTarget` | Creates render targets and prepares material instances. |
| `ApplyRuntimePaintTexturesToTargetMesh` | Applies runtime paint textures to target materials. |
| `PaintAtHitWithSettings` | Paints using a hit result and brush settings. |
| `PaintUnderCursorWithSettings` | Finds a paint hit under the cursor and paints it. |
| `SamplePaintedSurfaceColor` | Samples painted color for the color picker. |

## Multiplayer Settings

| Setting | Purpose |
| --- | --- |
| `bReplicateRuntimePaint` | Enables replicated runtime paint commands. |
| `bAutoEnableOwnerReplication` | Enables replication on the owning actor when needed. |
| `MaxReplicatedPaintCommands` | Limits stored paint command history. |
| `ReplicatedPaintReplayCommandsPerTick` | Controls late join replay budget. |
| `MaxReplicatedPaintDistance` | Server validation distance limit. |
| `MaxReplicatedBrushSize` | Server validation brush size limit. |
