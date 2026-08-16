# Changelog

## Version 1.1 Update Log

This update expands the runtime painting workflow with save/load support, painted texture export, improved controller modes, more accurate 3D color picking, and a cleaner Unreal-style documentation experience.

### Added

- Added Paint Patch History export/import support for saving and restoring painted results.
- Added Blueprint-friendly Paint Save / Load workflow support.
- Added painted Render Target export support.
- Added export support for both Painted Color and Painted Material Settings render targets.
- Added PNG, EXR, and HDR export format options.
- Added new Painting Controller modes:
  - Third Person Controller
  - First Person Controller
  - Drone Controller
  - Simple
  - None

### Improved

- Improved 3D Color Pick accuracy.
- Added selectable 3D color sampling modes:
  - Mesh Unlit Color
  - Viewport Lit Color
  - Mesh Unlit Color Then Viewport
- Mesh Unlit Color is now the default sampling mode, helping picked colors stay independent from scene lighting.
- Improved Painting Mode camera handling.
- Improved movement behavior across the new controller modes.
- Improved controller setup validation with clearer warnings for missing required components.
- Improved behavior when Spring Arm or Camera Component references are missing or invalid.
- Updated the documentation website with a cleaner Unreal Engine / Slate-style dark interface.

### Fixed

- Fixed lighting-related 3D color picking inaccuracies.
- Fixed Character Lock / Third Person Controller startup failures caused by incomplete camera setup.
- Fixed controller behavior around Spring Arm and Camera Component requirements.
- Re-tested painting controls, controller modes, camera behavior, and 3D color picking.
- Corrected several naming errors.
- Fixed several minor bugs.

## 1.0.0

Initial public documentation structure.

Included systems:

- Runtime GPU mesh painting
- Static and skeletal mesh target support
- UV island clipping
- Brush preview
- Color picker
- Eyedropper
- Eraser
- Multiplayer command replication
- Late join replay
- Win64 support declaration
