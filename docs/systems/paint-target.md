# Paint Target Component

`RuntimeMeshPaintTargetComponent` is the component that makes an actor paintable.

Add it to the actor that owns the mesh you want to paint. At runtime, the component creates the paint render targets, binds them to the mesh material, resolves paint hits, and applies paint through the GPU painting path.

![RuntimeMeshPaintTargetComponent added to an actor](/paint-target/01-add-component.png)

## What It Does

The paint target component is responsible for the mesh-side part of the system:

- Finds the mesh component that should receive paint.
- Creates the runtime color render target.
- Optionally creates the material settings render target.
- Assigns those render targets to dynamic material instances.
- Resolves hit data into UV and surface data.
- Applies paint commands locally.
- Stores replicated paint command history when multiplayer paint replication is enabled.

## Required Setup

For a basic paintable mesh, you usually only need:

- A mesh actor in the level.
- `RuntimeMeshPaintTargetComponent` on that actor.
- A material using the `Mesh Painting` material function.
- Collision that blocks the painting trace channel, usually `Visibility`.

The default render target settings are enough for a first test.

## Runtime Target Settings

The `Runtime Target` section controls the render targets and material texture bindings used by the component.

![Paint target runtime settings](/paint-target/02-target-settings.png)

| Setting | Purpose |
| --- | --- |
| `Mesh Targets` | Optional list of named mesh components that can be painted. |
| `Create Painted Material Settings Render Target` | Creates the extra render target used for painted metallic and roughness data. |
| `Runtime Render Target Width` | Width of the runtime paint texture. |
| `Runtime Render Target Height` | Height of the runtime paint texture. |
| `Runtime Render Target Format` | Texture format used by the runtime render targets. |
| `Initial Paint Color` | Starting clear color for the color paint target. |
| `Initial Material Settings Color` | Starting clear color for the material settings target. |
| `Painted Color Texture Parameter Name` | Material texture parameter that receives the color paint target. |
| `Painted Material Settings Texture Parameter Name` | Material texture parameter that receives the material settings target. |

In most cases, keep the texture parameter names at their defaults and set up the material through the plugin's `Mesh Painting` material function.

## Mesh Targets

If the actor has a single mesh component, the paint target can resolve it automatically.

If the actor has multiple mesh components, use `Mesh Targets` to choose exactly which components should receive paint. The values are component names, such as `StaticMeshComponent0`.

![Mesh Targets list](/paint-target/03-mesh-targets.png)

If the list contains multiple valid meshes, the component creates runtime paint data for each selected mesh.

## UV Channel

`UVChannel` decides which UV channel is used for hit UV calculation and GPU paint projection.

This must match the `UV Index` used by the `Mesh Painting` material function. If these values do not match, paint can appear offset, stretched, or on the wrong part of the mesh.

## Max Skeletal Mesh UV Fallback Distance

`Max Skeletal Mesh UVFallback Distance` is only used by skeletal mesh UV fallback resolution.

- `0.0` disables the distance limit.
- A value greater than `0.0` rejects fallback results if the resolved triangle is farther than that distance from the hit point.

This does not control brush size or preview size.

## UV Island Clip

`Clip Brush to UVIsland` keeps large brushes from painting unrelated UV islands when the brush overlaps seams in UV space.

Keep it enabled for most meshes, especially:

- Characters with many UV islands.
- Cubes or hard-surface meshes with separated UV faces.
- Large brush sizes.
- Visible seam areas.

`UVIsland Connection Tolerance` controls how close UV edges need to be before they are treated as connected. The default is usually correct; only change it if your mesh has unusual UV precision issues.

## Replication Settings

The replication settings are used when the paint target should work in multiplayer.

| Setting | Purpose |
| --- | --- |
| `Replicate Runtime Paint` | Enables replicated paint commands for this target. |
| `Auto Enable Owner Replication` | Lets the component enable replication on the owner actor on authority. |
| `Max Replicated Paint Commands` | Limits stored paint history. `0` keeps full history for late join. |
| `Replicated Paint Replay Commands Per Tick` | Controls how many stored commands are replayed each tick on clients. |
| `Max Replicated Paint Distance` | Optional server validation distance. `0` disables this limit. |
| `Max Replicated Brush Size` | Maximum brush size accepted by the server. |

For more details, see [Multiplayer](/systems/multiplayer).

## Useful Blueprint Functions

| Function | Use |
| --- | --- |
| `InitializeRuntimePaintTarget` | Creates runtime render targets and applies them to target materials. Usually called automatically at runtime. |
| `SetTargetMesh` | Sets a single mesh component as the paint target. |
| `SetMeshTargets` | Sets multiple mesh components as paint targets. |
| `AddMeshTarget` | Adds one mesh component to the target list. |
| `ClearMeshTargets` | Clears the configured mesh target list. |
| `PaintAtHitWithSettings` | Applies paint from an existing hit result and brush settings. |
| `PaintUnderCursorWithSettings` | Finds a paint hit under the cursor and applies paint. |
| `SamplePaintedSurfaceColor` | Samples the painted color under a hit result for color picking. |

## Common Mistakes

- The actor has multiple mesh components but `Mesh Targets` is empty or points to the wrong component name.
- The material does not use the `Mesh Painting` material function.
- The material `UV Index` does not match `UVChannel`.
- The mesh does not block the painting trace channel.
- `Clip Brush to UVIsland` is disabled and large brushes paint across unrelated UV islands.
- Multiplayer is expected to work, but the target actor or runtime paint replication is disabled.
