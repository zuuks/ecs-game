import { runSystems, clamp } from "./engine/ecs.js";
import { createInput, inputSystem } from "./engine/systems/input.js";
import { movementSystem } from "./engine/systems/movement.js";
import { gravitySystem } from "./engine/systems/gravity.js";
import { spawnSystem } from "./engine/systems/spawn.js";
import { collisionSystem } from "./engine/systems/collision.js";
import { scoreSystem } from "./engine/systems/score.js";
import { renderSystem } from "./engine/systems/render.js";
import { initGame } from "./game/init.js";
import { CONFIG } from "./game/config.js";
import { invulnSystem } from "./engine/systems/invuln.js";

const canvas = document.getElementById("c");
const hud = document.getElementById("hud");
const g = canvas.getContext("2d");

const input = createInput(window);

let world = initGame();

const restartSystem = (world, ctx) => {
  const game = world.comps.Game.get(1);
  if (!game || !game.over) return world;

  if (world.input.mouse.clicked) {
    return initGame();
  }
  return world;
};

const playerControlSystem = (world, ctx) => {
  const pid = [...world.comps.PlayerControl.keys()][0];
  if (!pid) return world;

  const pos = world.comps.Position.get(pid);
  const speed = CONFIG.player.speed;

  const k = world.input.keys;
  const dx =
    (k.has("ArrowRight") || k.has("d") ? 1 : 0) -
    (k.has("ArrowLeft") || k.has("a") ? 1 : 0);
  const dy =
    (k.has("ArrowDown") || k.has("s") ? 1 : 0) -
    (k.has("ArrowUp") || k.has("w") ? 1 : 0);

  const len = Math.hypot(dx, dy) || 1;
  const vx = (dx / len) * speed;
  const vy = (dy / len) * speed;

  const nextVel = new Map(world.comps.Velocity);
  nextVel.set(pid, { vx, vy });

  const nx = clamp(pos.x + vx * ctx.dt, 20, CONFIG.world.w - 20);
  const ny = clamp(pos.y + vy * ctx.dt, 20, CONFIG.world.h - 20);
  const nextPos = new Map(world.comps.Position);
  nextPos.set(pid, { x: nx, y: ny });

  return { ...world, comps: { ...world.comps, Velocity: nextVel, Position: nextPos } };
};

const whenPlaying = (sys) => (world, ctx) => {
  const gstate = world.comps.Game.get(1);
  return (gstate?.over || gstate?.paused) ? world : sys(world, ctx);
};

const systems = [
  inputSystem,                 
  restartSystem,                
  whenPlaying(playerControlSystem),
  whenPlaying(gravitySystem),
  whenPlaying(spawnSystem),
  whenPlaying(movementSystem),
  whenPlaying(collisionSystem),
  whenPlaying(scoreSystem),
  whenPlaying(invulnSystem),
  (w, ctx) => renderSystem(w, ctx), 
];

let last = performance.now();
const tick = (now) => {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;

  const events = input.pull();
  const ctx = { dt, now, events, g, hud };

  world = runSystems(systems, world, { ...ctx, events, events });


  world = runSystems(systems, world, ctx);

  requestAnimationFrame(tick);
};

requestAnimationFrame(tick);
