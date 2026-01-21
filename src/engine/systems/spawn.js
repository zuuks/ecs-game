import { addEntity, withComp, rand01 } from "../ecs.js";
import { CONFIG } from "../../game/config.js";

export const spawnSystem = (world, ctx) => {
  const gameId = 1;
  const game = world.comps.Game.get(gameId);
  if (!game || game.over) return world;

  const spawnerIds = [...world.comps.Spawner.keys()];
  if (spawnerIds.length === 0) return world;

  const spawnerId = spawnerIds[0];
  const sp = world.comps.Spawner.get(spawnerId);

  const scoreId = [...world.comps.Score.keys()][0];
  const score = scoreId ? world.comps.Score.get(scoreId)?.value ?? 0 : 0;

  const baseEvery = sp.every;
  const every = Math.max(0.18, baseEvery - score * 0.002); 

  const t = sp.t + ctx.dt;
  if (t < every) {
    const nextSpawner = new Map(world.comps.Spawner);
    nextSpawner.set(spawnerId, { ...sp, t });
    return { ...world, comps: { ...world.comps, Spawner: nextSpawner } };
  }

  let w1 = world;
  const id = w1.nextId;
  w1 = addEntity(w1);

  let r = rand01(w1.seed);
  const x = r.value * CONFIG.world.w;
  w1 = { ...w1, seed: r.seed };

  r = rand01(w1.seed);
  const size = CONFIG.meteor.minSize + r.value * (CONFIG.meteor.maxSize - CONFIG.meteor.minSize);
  w1 = { ...w1, seed: r.seed };

  r = rand01(w1.seed);
  const mult = Math.min(2.2, 1 + score * 0.01);
  const speed =
    (CONFIG.meteor.minSpeed + r.value * (CONFIG.meteor.maxSpeed - CONFIG.meteor.minSpeed)) * mult;
  w1 = { ...w1, seed: r.seed };

  w1 = withComp(w1, "Position", id, { x, y: -30 });
  w1 = withComp(w1, "Velocity", id, { vx: 0, vy: speed });
  w1 = withComp(w1, "Sprite", id, { kind: "circle", r: size, color: "#ffcc66" });
  w1 = withComp(w1, "Collider", id, { shape: "circle", r: size });
  w1 = withComp(w1, "Meteor", id, {});

  const nextSpawner = new Map(w1.comps.Spawner);
  nextSpawner.set(spawnerId, { ...sp, t: 0 });
  w1 = { ...w1, comps: { ...w1.comps, Spawner: nextSpawner } };

  return w1;
};
