# Packaging

The plugin is designed as a runtime plugin with content and shaders.

## Important Descriptor Values

The plugin contains assets:

```json
"CanContainContent": true
```

The runtime module loads early:

```json
"LoadingPhase": "PostConfigInit"
```

This is important for shader registration.

## Supported Platform

The plugin is currently tested on:

```text
Win64
```

Do not mark other platforms as supported until they are packaged and tested.

## Shipping Checks

Before distributing a build, test:

- Plugin content is cooked.
- Runtime shaders compile and load.
- Brush cursor/icon assets appear in packaged builds.
- Color picking works in packaged builds.
- Paint render targets are initialized correctly.
- Multiplayer command replay works after late join.
- No editor-only module is required at runtime.

## BuildPlugin

Use Unreal Engine's plugin packaging workflow when preparing a distributable plugin build.

After packaging, test the packaged plugin in a clean project instead of only testing inside the development project.
