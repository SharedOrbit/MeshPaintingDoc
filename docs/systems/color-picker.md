# Color Picker

The plugin includes a runtime color picker UI designed for mesh painting workflows.

## Features

- RGB and HSV controls
- Hex color input
- Current and previous color preview
- Palette grid
- Recent color history
- Eyedropper
- Eraser button
- Brush size, metallic, and roughness controls

## Recent Color History

Recent colors are added only after a successful paint action.

Changing a color slider or selecting a color without painting does not add that color to history.

## Eyedropper

The eyedropper samples visible color for paint workflows.

Typical behavior:

```text
Start eyedropper
-> Trace under cursor
-> Resolve paint target or visible surface
-> Sample color
-> Update picker
```

## Widget Blueprint

Create a Widget Blueprint using the color picker panel as the parent class.

The plugin also provides an editor utility path for generating an editable color picker widget layout:

```text
Tools > Runtime Mesh Painting > Create Editable Color Picker Widget
```

## Common Integration

Attach the color picker to a `PaintingModeControllerComponent` or any object that implements the runtime paint target interface.
