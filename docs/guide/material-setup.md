# Material Setup

The plugin paints into runtime render targets. Your mesh material decides how to display those textures.

## Texture Parameters

Use these texture parameter names:

```text
PaintedColorTexture
PaintedMaterialSettingsTexture
```

`RuntimeMeshPaintTargetComponent` assigns both textures to dynamic material instances at runtime.

## Color Texture

`PaintedColorTexture` stores the visible paint color.

A simple material can blend this texture into the base color.

Typical use:

```text
Base Color = PaintedColorTexture RGB
```

or:

```text
Base Color = lerp(OriginalBaseColor, PaintedColorTexture RGB, PaintMask)
```

## Material Settings Texture

`PaintedMaterialSettingsTexture` stores paint-side material properties used by the plugin, such as metallic and roughness settings.

The exact material graph depends on your project, but the common intent is:

```text
Metallic  = painted metallic channel
Roughness = painted roughness channel
```

## UV Channel

The target component uses the configured `UVChannel`.

Make sure:

- The selected UV channel exists on the mesh.
- UV islands do not overlap unless mirrored painting is intended.
- The material samples the same UV layout expected by the paint target.

## UV Island Clipping

The plugin includes brush clipping so large brushes do not paint unrelated UV islands.

Keep this enabled when working with:

- Cubes with separated faces
- Characters with many UV islands
- Meshes with visible seams
- Large brush sizes
