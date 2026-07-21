# Quick Start

This guide shows the shortest setup for painting a mesh at runtime.

## 1. Place a Mesh in the Level

Start by placing the mesh you want to paint in your scene.

![A mesh placed in the level](/quick-start/01-place-mesh.png)

## 2. Add the Paint Target Component

Select the actor that owns the mesh, then add `RuntimeMeshPaintTargetComponent` from the Details panel.

This component owns the runtime render targets, prepares the paint textures, and applies them to the target mesh materials when the game starts.

![RuntimeMeshPaintTargetComponent added to the mesh actor](/quick-start/02-add-paint-target.png)

## 3. Review the Runtime Target Settings

The default render target settings are enough for a first test. You can later adjust the texture resolution, render target format, initial colors, and texture parameter names from the `Runtime Target` section.

![Runtime target settings](/quick-start/03-runtime-target-settings.png)

## 4. Choose Mesh Targets When Needed

If the actor has a single mesh component, the target component can resolve it automatically.

If the actor contains multiple mesh components and you only want specific meshes to be paintable, add their component names to `Mesh Targets`.

![Mesh Targets list](/quick-start/04-mesh-targets.png)

## 5. Check Collision

The mesh must block the trace channel used by the painting controller. By default, this is `Visibility`.

If the trace does not hit the mesh, the brush preview cannot lock onto the surface and painting will not be applied.

![Visibility collision set to Block](/quick-start/05-visibility-collision.png)

## 6. Set Up the Mesh Material

Open the mesh material and set up the `Mesh Painting` material function correctly.

For more information about the material setup, see [Material Setup](/guide/material-setup).

![Mesh Painting material function connected to a material](/quick-start/06-material-function.png)

## 7. Add the Painting Controller

Go to the player pawn, character, or controller class that will handle painting input, then add `PaintingModeControllerComponent`.

This component handles paint mode input, brush settings, brush preview, color picking, camera behavior, and multiplayer paint command submission.

![PaintingModeControllerComponent added to the player character](/quick-start/07-add-paint-controller.png)

## 8. Optional Paint Target Filter

You can leave `PaintTargetComponents` empty on the controller. In that case, the controller can paint any valid `RuntimeMeshPaintTargetComponent` it hits.

If you fill `PaintTargetComponents`, painting is limited to only the target components in that list.

## 9. Enter Paint Mode

Start paint mode with your configured input or by calling `EnterPaintingMode`.

When setup is correct, the color picker opens, the brush preview follows the mesh surface, and left mouse painting applies color to the runtime paint texture.

That's all you need for a basic runtime paint test. If your project needs multiplayer, custom materials, input changes, or advanced brush behavior, continue with the other documentation pages.
