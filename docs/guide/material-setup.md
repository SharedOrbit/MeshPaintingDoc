# Material Setup

Runtime Mesh Painting stores the painted result in UV space. Your mesh material uses the `Mesh Painting` material function to combine that runtime paint layer with the material's original look.

For a basic setup, add the `Mesh Painting` function to your material and connect its outputs to the material output:

- `BaseColor` to `Base Color`
- `Metallic` to `Metallic`
- `Roughness` to `Roughness`

![Mesh Painting material function setup](/material-setup/01-mesh-painting-function.png)

## Default Setup

You do not have to plug anything into the function inputs for a first test. If the inputs are left empty, the function uses its default values and the mesh can still receive runtime paint.

This is the fastest way to confirm that the paint target and painting controller are working correctly.

## Using Your Own Material Values

If your mesh already has textures or custom material values, connect them to the function inputs:

- `BaseColor` for the original base color or base color texture.
- `Metallic` for the original metallic value or texture.
- `Roughness` for the original roughness value or texture.

When you paint, the runtime paint layer is drawn over these values. In the painted area, the paint becomes visible instead of the original texture.

## Alpha

`Alpha` controls how strongly the runtime paint covers the original material.

By default, `Alpha` is `1`, so painted areas fully show the paint result. If you lower or customize this value, the original material can remain visible together with the painted color.

## UV Index

`UV Index` is important. It tells the material function which UV channel should be used for the runtime paint lookup.

This value must match the `UVChannel` value on `RuntimeMeshPaintTargetComponent`.

If the material uses a different UV index than the paint target component, the paint can appear in the wrong place, stretch incorrectly, or show up on unrelated parts of the mesh.

## Quick Check

Before testing in a full character or production material, verify the setup on a simple mesh:

- Add `RuntimeMeshPaintTargetComponent` to the mesh actor.
- Add the `Mesh Painting` material function to the mesh material.
- Make sure `UV Index` matches the target component's `UVChannel`.
- Enter paint mode and confirm that the brush paints the expected surface.
