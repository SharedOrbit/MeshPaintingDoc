# Troubleshooting

Runtime Mesh Painting writes paint into a render target through mesh UVs. Most issues come from one of these areas:

- Target component setup
- Material setup
- Collision or trace setup
- The mesh UV layout

If the plugin works on a simple cube but fails on a production asset, treat it as an asset, UV, material slot, LOD, or collision issue first.

## Start Here

Check these before changing advanced settings:

- The actor has `RuntimeMeshPaintTargetComponent`.
- The player has `PaintingModeControllerComponent`.
- The mesh material uses the `Mesh Painting` material function.
- The material function outputs are connected to the material output.
- Material `UV Index` matches `RuntimeMeshPaintTargetComponent.UVChannel`.
- The mesh blocks the controller `Paint Trace Channel`, usually `Visibility`.
- The correct mesh component and material section are being hit.
- `Clip Brush to UVIsland` is enabled unless cross-island painting is intentional.

## Paint Does Not Appear At All

If nothing appears, check the basic chain:

```text
Controller trace
-> Paint target component
-> Runtime render target
-> Mesh Painting material function
-> Material output
```

Common causes:

- Missing or uninitialized `RuntimeMeshPaintTargetComponent`.
- The controller target filter excludes the target.
- `Mesh Targets` points to the wrong component.
- The mesh material does not contain the `Mesh Painting` function.
- The material slot you are hitting uses a different material.
- `UVChannel` and material `UV Index` do not match.
- The mesh does not block the paint trace channel.

## Brush Preview Appears, But Paint Does Not Apply

If the brush preview follows the surface, tracing is usually working. In this case, the most common cause is material setup.

Check:

- The mesh material uses the `Mesh Painting` material function.
- The function outputs are connected to `Base Color`, `Metallic`, and `Roughness` as needed.
- The material is assigned to the mesh section you are painting.
- The runtime paint texture parameter names are still compatible with the plugin material function.
- The target render targets were created successfully.

Fix the material first, then check the paint target and UV channel.

## Brush Preview Missing Or Flickering

This is usually a trace, collision, or target filtering issue.

Check:

- The mesh blocks `Paint Trace Channel`.
- `Paint Trace Complex` is enabled when simple collision is too rough.
- Another object is not blocking the trace before the paintable mesh.
- The cursor is not over the color picker UI.
- Eyedropper mode is not active.
- `Control Mode` is not `None` unless you drive painting manually.
- The target is not excluded by `Paint Target Components`.

For skeletal meshes, per-poly collision is not required, but the physics or collision setup still needs to produce hits near the visible surface.

## Paint Appears In The Wrong Place

Wrong-location paint is usually a UV mismatch or a broken paint UV layout.

Check:

- `RuntimeMeshPaintTargetComponent.UVChannel` and material `UV Index` are the same.
- The selected UV channel exists on the mesh.
- The selected paint UV channel is unwrapped correctly.
- The paint UVs are inside the expected 0-1 space.
- The UVs are not collapsed, zero-area, stacked unintentionally, or assigned to the wrong channel.
- The material is not using another `TextureCoordinate` path after the paint function.
- LODs use compatible paint UV layouts.
- The mesh does not rely on unusual negative or non-uniform scale.

If changing `UVChannel` fixes the issue, the plugin was painting correctly but the material or asset was reading another UV channel.

If the model UVs are broken, the plugin cannot solve that in code. Runtime Mesh Painting can only paint through the UV data the model provides, so repairing invalid UVs is the responsibility of the asset/model setup.

If the paint appears on a mirrored or duplicated part of the model, also check [Mirrored Or Overlapped UVs](#mirrored-or-overlapped-uvs).

## UV Islands, Seams, And Large Brushes

Large brushes can reach outside the hit UV island in texture space. `Clip Brush to UVIsland` prevents unrelated UV islands from being painted.

Keep it enabled for:

- Characters with many UV islands.
- Cubes or hard-surface meshes with separated faces.
- Large brush sizes.
- Visible seam areas.

Visible seams usually happen because adjacent world-space surfaces are separate UV islands. The brush is clipped to the hit island, so the other side of the seam may need its own stroke.

To reduce seam visibility:

- Use a dedicated paint UV channel with cleaner island placement.
- Give islands enough padding.
- Increase render target resolution when islands are too small.
- Keep seams away from highly visible areas when possible.
- Paint across both sides of the seam when the UVs are split.

A UV-space paint system cannot make two separated UV islands behave exactly like one continuous surface unless both islands receive paint.

## Mirrored Or Overlapped UVs

Mirrored and overlapped UVs are valid only when shared paint is acceptable.

If two surfaces share the same UV texels, they share the same paint pixels:

- Painting one side can paint the mirrored side.
- Erasing one side can erase the other.
- Both surfaces can sample the same color.
- They cannot be painted independently on that UV channel.

This is expected for UV-space painting. If each side must be painted independently, create a unique paint UV channel and set both `RuntimeMeshPaintTargetComponent.UVChannel` and material `UV Index` to that channel.

You can still keep mirrored UVs for normal textures. The paint UV channel can be separate.

## Brush Size Looks Different Across Meshes

The preview ring is world-space, but the final paint footprint depends on UV texel density.

Brush size can look inconsistent when:

- Two meshes have different paint UV texel density.
- A surface uses a very small UV island.
- Object scale is not applied.
- Render target resolution is too low.
- The material reads a different UV channel than the target component.

Use consistent texel density, apply object scale before export, and use a dedicated paint UV channel for assets that need predictable brush size.

## Triangle Lines Or Artifacts

If artifacts follow triangle edges or diagonals, inspect the mesh data.

Check:

- Degenerate or very thin triangles.
- Zero-area UV triangles.
- Overlapped UV triangles.
- UV islands that are too small for the render target.
- LODs with different triangulation or UV layout.
- Material logic that changes UVs after the paint function.

When the artifact follows mesh triangulation, changing brush settings usually hides the symptom instead of fixing the source.

## Skeletal Mesh Notes

Check:

- The skeletal mesh has the selected `UVChannel` on the rendered LOD.
- Collision or the physics asset produces hits near the visible surface.
- The animated pose is not too far from collision.
- LODs have compatible paint UVs.
- Mirrored body parts do not share paint UVs unless mirrored paint is desired.

`Max Skeletal Mesh UVFallback Distance` only limits skeletal UV fallback resolution. It does not control brush size. `0.0` disables the distance limit.

## Static Mesh, Nanite, And LOD Notes

For static meshes:

- Keep paint UVs available on LOD 0 and any LOD used by the material.
- Keep paint UV layouts compatible across LODs.
- Make sure the visible material section is the section being hit.
- Test a non-Nanite duplicate if a Nanite asset behaves differently during hit or UV resolution.

## Material Color Or Material Settings Look Wrong

If color is too dark, washed out, or black paint does not look black, check the material graph after the paint function.

Common causes:

- The paint output is multiplied by another texture or tint.
- `Alpha` is lower than expected.
- Vertex color, overlay logic, or another material layer overrides the result.
- Lighting and exposure change how the color appears in the level.

For metallic and roughness:

- Enable `Create Painted Material Settings Render Target`.
- Connect the material function metallic and roughness outputs.
- Make sure the material does not override those values after the paint function.

## Brush Preview Does Not Match Painted Area

Check:

- Preview and paint resolve the same target component.
- `BrushSize` is changed through `SetBrushSize` so UI and controller state stay synchronized.
- Material `UV Index` and target `UVChannel` match.
- The mesh has consistent paint UV density.
- The mesh does not use mirrored or overlapped paint UVs where independent paint is expected.

On badly scaled UVs, the world-space preview can be correct while the UV-space paint result looks stretched.

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

You do not need to change your original art UVs. You can keep them for normal textures and add a separate UV channel only for runtime painting.
