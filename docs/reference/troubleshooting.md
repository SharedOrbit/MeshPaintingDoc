# Troubleshooting

## Paint Does Not Appear

Check:

- The target actor has `RuntimeMeshPaintTargetComponent`.
- `InitializeRuntimePaintTarget` was called.
- The mesh target is valid.
- The mesh material samples `PaintedColorTexture`.
- The plugin content is available at runtime.
- The selected `UVChannel` exists on the mesh.

## Brush Paints the Wrong UV Area

Check:

- UV islands are not intentionally overlapping.
- The correct UV channel is selected.
- UV island clipping is enabled.
- The mesh uses the expected LOD and material section.

## Brush Preview Does Not Match Paint

Check:

- The same hit result is used for preview and paint.
- The target mesh component is the same.
- The active control mode is not moving the camera during paint.
- The brush size UI and controller brush size are synchronized.

## Packaged Build Issues

Check:

- Plugin content is cooked.
- Runtime shader files are included.
- Module loading phase remains `PostConfigInit`.
- No editor-only module is referenced by runtime code.

## Multiplayer Paint Missing for Late Join

Check:

- The owning actor replicates.
- `bReplicateRuntimePaint` is enabled.
- Replicated command history is not capped too low.
- Replay budget is high enough for the test case.
- Dedicated server is validating commands successfully.
