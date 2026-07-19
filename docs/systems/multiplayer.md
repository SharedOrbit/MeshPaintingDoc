# Multiplayer

Runtime Mesh Painting uses command replication instead of texture replication.

This keeps network traffic small and lets each client reproduce the same paint result locally through the GPU paint path.

## Core Idea

The server does not replicate render target pixels.

Instead, each paint action is represented by a compact command:

- Target component
- Mesh target index
- LOD
- UV channel
- Command id
- Stroke id
- Brush ray
- Brush center
- Brush normal
- Brush size
- Color
- Opacity
- Hardness
- Metallic and roughness
- Erase flag
- Material settings write flag

## Live Paint Flow

```text
Local input
-> Build paint command
-> Apply local GPU prediction
-> Send command batch to server
-> Server validates command
-> Server adds command to authoritative history
-> Other clients receive the command
-> Each client applies the command locally
```

## Why Commands Instead of Textures

Texture replication is expensive and does not scale well with low bandwidth.

Command replication is smaller because it sends the input needed to reproduce the paint stroke, not the full render target.

## Late Join

Late join clients receive the replicated command history.

The client initializes an empty paint target, then replays accepted commands over multiple ticks:

```text
Join game
-> Initialize paint render targets
-> Receive command history
-> Queue replay
-> Apply commands with a frame budget
```

## Dedicated Server

Dedicated servers do not render paint textures.

They only:

- Receive RPCs
- Validate commands
- Assign command ids
- Store authoritative history
- Replicate commands to clients

The visual paint result is produced on clients and listen-server hosts.

## Important Files

```text
RuntimeMeshPaintReplicationTypes.h
RuntimeMeshPaintReplicationTypes.cpp
PaintingModeControllerComponent.h/.cpp
RuntimeMeshPaintTargetComponent.h/.cpp
```
