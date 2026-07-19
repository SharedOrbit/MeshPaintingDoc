# Installation

## Requirements

- Unreal Engine 5.7
- Windows / Win64
- Enhanced Input plugin
- A material prepared to sample the runtime paint textures

## Add the Plugin

Place the plugin in your Unreal project:

```text
YourProject/
  Plugins/
    RuntimeMeshPainting/
```

Enable it from:

```text
Edit > Plugins > RuntimeMeshPainting
```

Restart the editor after enabling the plugin.

## Plugin Descriptor Notes

The plugin is a runtime module and contains content:

```json
"CanContainContent": true
```

The module uses early loading because runtime global shaders need to be registered before shader type initialization:

```json
"LoadingPhase": "PostConfigInit"
```

The plugin is currently declared for Win64:

```json
"SupportedTargetPlatforms": ["Win64"]
```

## Required Input Plugin

Enhanced Input is required:

```json
"Plugins": [
  {
    "Name": "EnhancedInput",
    "Enabled": true
  }
]
```

## Content Paths

Runtime assets are stored under the plugin content root:

```text
/RuntimeMeshPainting/Input/
/RuntimeMeshPainting/Textures/
```

Make sure plugin content is included when packaging.
