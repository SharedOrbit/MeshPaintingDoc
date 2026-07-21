# Troubleshooting

Use this page when painting behaves differently than expected.

Runtime Mesh Painting paints into a render target through mesh UVs. Because of that, many visible issues come from one of four places:

- Target setup
- Material setup
- Collision or trace setup
- The mesh UV layout itself

If the plugin works on a simple cube or a clean test mesh, but fails only on a production model, start by checking the model UVs, LODs, collision, and material slots before changing plugin settings.

## Fast Checklist

Check these first:

- The actor has `RuntimeMeshPaintTargetComponent`.
- The mesh material uses the `Mesh Painting` material function.
- The material `UV Index` matches `RuntimeMeshPaintTargetComponent.UVChannel`.
- The mesh blocks the controller `Paint Trace Channel`, usually `Visibility`.
- `PaintingModeControllerComponent` is added to the local player pawn, character, or controller.
- `Control Mode` is not `None` unless you are driving painting manually.
- If the actor has multiple mesh components, `Mesh Targets` contains the correct component names or is left empty intentionally.
- If the controller has `Paint Target Components`, the target you are trying to paint is in that allow list.
- `Clip Brush to UVIsland` is enabled unless you intentionally want paint to cross UV islands.
- The paintable material is assigned to the mesh section you are actually hitting.

## Paint Does Not Appear At All

Common causes:

- `RuntimeMeshPaintTargetComponent` is missing from the mesh actor.
- The target was not initialized at runtime.
- The mesh material does not use the `Mesh Painting` material function.
- The material function output is not connected to the material output.
- The material `UV Index` does not match the target component `UVChannel`.
- The mesh does not block the painting trace channel.
- The controller cannot find the target because `Paint Target Components` filters it out.
- `Mesh Targets` points to a wrong component name.
- The mesh uses a material slot that does not contain the paint function.

Fix:

1. Test the same setup on a simple mesh.
2. Confirm the brush preview appears on the surface.
3. Confirm the material uses the paint function.
4. Confirm `UV Index` and `UVChannel` are the same value.
5. Confirm the hit mesh component is the same component configured in `Mesh Targets`.

## Brush Preview Appears, But Paint Does Not Apply

This usually means the trace hit is visible, but the paint target or material path rejects the final paint.

Check:

- The cursor is not over the color picker UI.
- Eyedropper mode is not active.
- `Paint Brush Material` is valid or the default brush material is available.
- The hit component belongs to a valid `RuntimeMeshPaintTargetComponent`.
- The target render targets were created successfully.
- The material texture parameter names are still at the expected defaults when using the plugin material function.

If the brush preview follows the surface but no paint appears, the collision side is probably working. Focus on the target component, material function, UV channel, and material slots.

## Brush Preview Missing, Flickers, Or Disappears

Common causes:

- The mesh does not block `Paint Trace Channel`.
- `Paint Trace Complex` is disabled and the simple collision does not match the visual surface closely enough.
- The controller is in `None` control mode.
- The target is excluded by `Paint Target Components`.
- The cursor is over the color picker UI.
- Eyedropper mode is active.
- The mesh collision is behind or far away from the visible mesh.
- The camera ray is hitting another object before the paintable mesh.

For skeletal meshes, per-poly collision is not required by the plugin, but the collision still needs to produce useful hits near the visible surface. If the physics asset is too rough or does not cover the painted area, the brush can appear to miss the mesh.

## Paint Appears In The Wrong Place

Most wrong-location paint issues come from UV mismatch.

Check:

- `RuntimeMeshPaintTargetComponent.UVChannel` and material `UV Index` match.
- The selected UV channel exists on the mesh.
- The UV channel used for painting is the same UV channel used by the `Mesh Painting` material function.
- The mesh LODs use compatible UV layouts.
- The material is not using a different `TextureCoordinate` node after the paint function.
- The mesh has applied scale and does not rely on unusual negative or non-uniform transform setup.

If changing `UVChannel` fixes the issue, the original problem was not the brush. It was the material or mesh using a different UV channel than the paint target.

## Large Brush Paints Unrelated Areas

This can happen when the brush footprint in UV space reaches texels that belong to another part of the UV layout.

Check:

- `Clip Brush to UVIsland` is enabled.
- The model does not have intentional UV overlap on the paint UV channel.
- The model does not use mirrored UVs on the paint UV channel if independent painting is required.
- UV islands are inside the 0-1 UV space.
- Islands have enough gutter between them.
- `UVIsland Connection Tolerance` has not been set too high.
- The render target resolution is high enough for the island size.

Important: UV island clipping prevents large brushes from bleeding into unrelated islands. Do not disable it to hide a seam issue unless you accept the risk of painting unrelated UV islands.

## Visible Seams Or Unpainted UV Cuts

Visible seams usually come from the mesh UV layout, not from the paint color itself.

Common causes:

- Two adjacent world-space surfaces are separate UV islands.
- The brush is clipped to the hit UV island, so the other side of the seam is not painted by the same dab.
- The paint UV has very small gutters.
- The render target resolution is too low for the island size.
- The material uses mipmaps or filtering that exposes unpainted neighboring texels.
- The seam is placed in a highly visible area of the model.

Fix:

- Paint both sides of the seam by moving the brush across the seam.
- Use a dedicated paint UV channel with better island placement.
- Increase the render target resolution for high-detail assets.
- Give UV islands enough padding.
- Place paint UV seams in less visible areas when possible.

If you need a brush stroke to flow perfectly across a UV seam, the paint UVs need to support that. A UV-space painting system cannot make two separated UV islands behave exactly like one continuous island unless both islands receive paint.

## Mirrored Or Overlapped UVs

Mirrored and overlapped UVs are not automatically broken, but they have a very specific meaning for runtime painting.

If two mesh surfaces share the same UV texels, they share the same paint pixels.

That means:

- Painting one side can also paint the mirrored side.
- The color picker can sample the same paint color from both surfaces.
- Erasing one overlapped surface can erase the other.
- It is not possible to paint those two surfaces independently on the same paint UV channel.

This is expected behavior for UV-space painting. The plugin writes to a texture. If two polygons use the same part of that texture, they will receive the same paint.

Use mirrored UVs only when mirrored paint is acceptable. If the player must paint each side independently, create a separate unique paint UV channel and set both:

- `RuntimeMeshPaintTargetComponent.UVChannel`
- Material function `UV Index`

to that unique paint UV channel.

You can still keep your original mirrored UVs for normal textures. The dedicated paint UV channel can be different from the base color or normal map UV channel.

## Model And UV Quality Checklist

When a specific model behaves badly, inspect the asset with this checklist:

- The paint UV channel exists.
- UVs are inside 0-1 unless you intentionally understand the tiling result.
- No unexpected UV overlap exists on the paint UV channel.
- Mirrored UVs are not used where independent painting is expected.
- UV islands have enough padding.
- UV islands are not extremely tiny compared to the render target resolution.
- Triangles do not have zero-area or near-zero-area UVs.
- The mesh does not contain degenerate triangles.
- The mesh is triangulated consistently before export.
- LODs use compatible paint UV layouts.
- All material sections that should be painted use a material with the paint function.
- Object scale is applied before export when possible.
- Texel density is reasonably consistent across the paintable surface.

Uneven texel density is a common reason why the same brush feels larger on one part of a mesh and smaller on another. The brush radius is world-space for the preview, but the final texture footprint is still limited by the mesh UV layout.

## Brush Size Looks Different On Different Meshes

The visible brush ring is based on world size, but the painted result is written into UV texture space.

Brush size can appear inconsistent when:

- Two meshes have very different UV texel density.
- One mesh uses a much smaller UV island for the same world-space surface area.
- Object scale is not applied.
- The material uses a different UV channel than the target component.
- The render target resolution is too low for the mesh.

Fix:

- Use consistent texel density on the paint UV channel.
- Use a dedicated paint UV channel for runtime painting.
- Apply object scale before export.
- Keep `UVChannel` and material `UV Index` matched.
- Increase render target resolution for large or detailed meshes.

## Diagonal Lines Or Triangle Shaped Artifacts

Triangle-shaped artifacts usually point to mesh data or UV layout problems.

Check:

- Degenerate or very thin triangles.
- Zero-area UV triangles.
- UV islands that are too small for the render target resolution.
- Overlapped UV triangles.
- Wrong UV channel.
- LODs with different triangulation or UV layout.
- A material graph that modifies UVs after the paint function.

If the artifact follows the mesh triangulation, inspect the model before changing brush settings.

## Skeletal Mesh Specific Issues

Check:

- The skeletal mesh has the selected `UVChannel` on the rendered LOD.
- The collision or physics asset produces hits near the visible surface.
- The animated pose is not too far from the collision used for tracing.
- `Max Skeletal Mesh UVFallback Distance` is not set too low.
- Mirrored body parts do not share paint UVs unless mirrored paint is desired.
- LODs have compatible UV layouts.

`Max Skeletal Mesh UVFallback Distance` only limits skeletal UV fallback resolution. It does not control brush size. A value of `0.0` disables this distance limit. If valid hits are rejected on animated meshes, test with `0.0` first, then add a limit only if needed.

## Static Mesh, Nanite, And LOD Checks

For static meshes:

- Keep paint UVs available on LOD 0 and any LODs used by the material.
- Keep paint UV layouts compatible across LODs.
- Test a non-Nanite duplicate if a Nanite mesh behaves differently during hit or UV resolution.
- Make sure the visible material section is the section being hit.

For diagnosis, temporarily force a simple material and a simple non-Nanite mesh. If the issue disappears, the problem is likely asset data, LOD layout, material setup, or collision setup.

## Material Looks Too Dark, Washed Out, Or Cannot Paint Black

Check:

- The `Mesh Painting` function output is connected directly enough to affect the final material.
- The material is not multiplying the painted color by a dark texture later in the graph.
- `Alpha` is not set lower than expected.
- The material is not using additional tint, vertex color, or overlay logic after the paint function.
- Lighting, exposure, and material shading can change how the chosen color appears in the level.

Painting black requires the material to actually use the painted base color. If another part of the material brightens, tints, or replaces the base color after the paint function, black will not appear as pure black.

## Metallic Or Roughness Does Not Change

Check:

- `Create Painted Material Settings Render Target` is enabled on the target component.
- The material function metallic and roughness outputs are connected.
- The controller brush settings contain the expected `Brush Metallic` and `Brush Roughness` values.
- Eraser mode is not active.
- The material is not overriding metallic or roughness after the paint function.

If color paint works but material settings do not, focus on the material settings render target and material output connections.

## Multiple Mesh Components On One Actor

If an actor has multiple mesh components:

- Leave `Mesh Targets` empty to allow all valid mesh components on the actor.
- Fill `Mesh Targets` only when you want specific components to be paintable.
- Use the exact component names.
- Make sure each selected mesh component has a material using the paint function.

If only one mesh paints, the other component may not be selected, may not block the trace channel, or may not use the paint material.

## Controller Target Filtering

`PaintingModeControllerComponent.Paint Target Components` is an allow list.

If this list is empty, the controller can paint any valid paint target it hits.

If this list has entries, the controller can only paint those specific target components. A correct mesh can still be ignored if its target component is not in the list.

## Color Picker Does Not Open

Check:

- `Auto Create Color Picker Widget` is enabled.
- `Color Picker Widget Class` is valid.
- Paint mode is actually entered.
- `Control Mode` is not `None` unless you manually open the widget.
- The owner is locally controlled.
- The default input assets are loaded or your custom input mapping calls `EnterPaintingMode`.

The default toggle input is `P` when the plugin default input assets are loaded.

## Color Picker History Does Not Update

Recent colors are added after successful painting, not when the color value changes.

This is intentional. Moving sliders, using the color wheel, typing hex, or selecting a palette color should not add history by itself. If history does not update, confirm that an actual paint command succeeded and that eraser mode is not active.

## Eyedropper Or Pick Color Does Not Work

Check:

- The target mesh blocks the eyedropper trace channel.
- `Eyedropper Trace Complex` is enabled if the simple collision is not accurate enough.
- The cursor is not over UI that blocks the sample.
- The paint target material and render target are initialized.
- In packaged builds, the viewport sample path is tested in the target window mode and platform.

If you see a warning about `FindCollisionUV` and `Support UV From Hit Results`, check your project Blueprints or old custom widgets. The plugin painting path resolves UVs internally. Do not call Unreal's `FindCollisionUV` yourself unless that engine project setting is enabled.

## Brush Cursor Missing In Packaged Builds

For a custom brush cursor texture:

- Use a normal `Texture2D`.
- Enable `CPU Copy` on the texture.
- Keep the texture small, usually `64x64` or `128x128`.
- Keep transparent areas transparent.
- Keep the tintable brush tip as the saturated color area.

If the cursor works in editor but not in Shipping, the texture is usually not readable at runtime or not cooked.

## Input Does Not Work

Check:

- The Enhanced Input plugin is enabled.
- `Load Default Input Assets` is enabled, or every input action and mapping context is assigned manually.
- `Painting Input Mapping Context` and `Painting Toggle Input Mapping Context` are valid.
- The component is on the locally controlled player actor.
- `Control Mode` is not `None`.
- No higher-priority input mapping consumes the same keys.

Default quick controls are documented in [Quick Start](/guide/quick-start).

## Character Or Camera Moves While Painting

Check:

- Use `Character Lock` only on a normal character setup with camera, spring arm, and movement component.
- Use `Simple` for drone pawns, custom camera pawns, or non-character tools.
- Use `None` only when you handle all input yourself.
- Orbit, pan, and brush-size actions should not share the same input without modifier keys.
- Heavy custom input logic should not also move the pawn while paint mode is active.

If a drone pawn pans or orbits incorrectly, use `Simple` mode and verify the input action axis values in your mapping context.

## Brush Preview Does Not Match Painted Area

Check:

- The preview and paint use the same target component.
- The controller target filter is not changing between preview and paint.
- `BrushSize` is changed through `SetBrushSize` so UI and controller state stay synchronized.
- The material `UV Index` and target `UVChannel` match.
- The mesh has consistent UV density.
- The mesh does not use mirrored or overlapped UVs where independent paint is expected.

On badly scaled UVs, the world-space preview can look correct while the UV-space paint result looks stretched. That is a paint UV layout issue.

## Packaged Build Issues

Check:

- The plugin descriptor keeps `"CanContainContent": true`.
- The runtime module loading phase stays `PostConfigInit`.
- The target platform is supported and tested. The plugin is currently marked for `Win64`.
- Plugin content is cooked.
- Runtime shader files are included.
- No runtime code depends on editor-only modules.
- Custom cursor textures are runtime readable.
- Color picker widgets and input assets are cooked.

If painting works in editor but not in Shipping, test a clean packaged project with only one paintable mesh first. Then add your project content back until the failing asset or setting is clear.

## Multiplayer Paint Does Not Replicate

Check:

- `Replicate Runtime Paint` is enabled on the target component.
- The owner actor replicates.
- The painting controller is on a player-owned actor or component.
- The target actor is relevant to the receiving client.
- The server validation limits are not rejecting the brush.
- `Max Replicated Brush Size` is not lower than the brush being used.
- `Max Replicated Paint Distance` is not too strict.
- The material and UV setup are identical on all clients.

The plugin replicates paint commands, not render target textures. Each client must have a valid local paint target setup so it can replay the command into its own render target.

## Late Join Does Not Rebuild Existing Paint

Check:

- `Max Replicated Paint Commands` is `0` for full history, or high enough for your session.
- `Replicated Paint Replay Commands Per Tick` is high enough to catch up in a reasonable time.
- The target actor exists and replicates before the client expects replay.
- The paintable material is initialized on the joining client.
- The same `UVChannel` is used on server and clients.

If history is capped too low, late join can only rebuild commands that still exist in history.

## Performance Or Stutter

Common causes:

- Very high render target resolution on many paint targets.
- Very large brush size on high-detail UV layouts.
- Many paint commands submitted per frame.
- Heavy Blueprint logic bound to `OnPaintTriggered`, `OnColorChanged`, or other high-frequency events.
- High `Replicated Paint Replay Commands Per Tick` during late join.
- Complex collision or very expensive scene traces.
- Too many brush preview segments.

Fix:

- Start with the default render target size, then increase only when the asset needs it.
- Avoid heavy Blueprint work during continuous input events.
- Use commit events for UI work that only needs final values.
- Keep brush preview segments reasonable.
- Reduce replay commands per tick if late join causes hitches.

## How To Tell Setup Issue From Asset Issue

Use this test:

1. Create a new level.
2. Add one simple cube or sphere.
3. Add `RuntimeMeshPaintTargetComponent`.
4. Add the `Mesh Painting` material function to a simple material.
5. Use `UVChannel = 0` and material `UV Index = 0`.
6. Paint with the default controller and default brush.

If this works, the core plugin path is working. Then the issue is probably one of these:

- The production mesh UVs.
- The production material graph.
- The production collision setup.
- A target filter.
- A multiplayer replication setting.
- A packaged build cook/readability setting.

If the simple test also fails, start with component setup, input setup, collision, and material function wiring.

## Asset Preparation Recommendations

For the most reliable runtime painting:

- Use a dedicated paint UV channel.
- Keep paint UVs unique when independent surface painting is required.
- Avoid mirrored UVs on the paint UV channel unless mirrored painting is desired.
- Keep UV islands inside 0-1.
- Use enough island padding.
- Keep texel density consistent.
- Keep LOD paint UVs compatible.
- Triangulate consistently before export.
- Apply object scale before export.
- Test the model with a simple material before using a complex production material.

This does not mean your art UVs must change. You can keep existing UVs for normal textures and add a separate paint UV channel only for runtime painting.
