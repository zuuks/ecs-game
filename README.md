# ECS Dodge Meteors (Functional JS)

Small browser game built on a custom **Entity–Component–System (ECS)** engine written in **JavaScript**, using a **functional programming** approach (immutability, function composition, higher-order functions, map/filter/reduce).

**Game:** Move the player and dodge falling meteors. Score increases over time. You have 3 lives, brief invulnerability after a hit, pause, and a simple starfield background.

---

## Features

### ECS Engine
- **Entities** are plain numeric IDs
- **Components** are stored in `Map` structures (e.g. `Position`, `Velocity`, `Sprite`, `Collider`, …)
- **Systems** are pure functions `(world, ctx) => newWorld` (render is the only side-effect system)

### Required Systems (assignment)
- **Input/UI System** (keyboard + mouse)  
- **Rendering System** (Canvas 2D)

### Additional Game Systems (student-defined)
- Player control
- Movement
- Spawner (meteors)
- Collision (lives + invulnerability)
- Score
- Stars background
- Pause / Restart logic

---

## Controls
- **WASD / Arrow Keys** – move
- **Space** – pause / resume
- **Mouse click** – restart when Game Over

---

## Run Locally
1. Clone/download the repo
2. Open the folder in **VS Code**
3. Install the **Live Server** extension
4. Right click `index.html` → **Open with Live Server**

No build tools required.

---

## Functional Programming Notes
- **Immutability:** systems return a new `world` (new `Map` copies where needed)
- **Function composition:** `runSystems(systems, world, ctx)` runs a pipeline via `reduce`
- **Higher-order functions:** `whenPlaying(system)` runs systems only when not paused/over
- **map/filter/reduce:** used for entity queries and component updates

---

## Project Structure
```
index.html
src/
  main.js
  game/
    init.js
    config.js
  engine/
    ecs.js
    systems/
      input.js
      render.js
      movement.js
      gravity.js
      spawn.js
      collision.js
      score.js
      stars.js
      invuln.js
```

---

## License
MIT (or choose your preferred license)
