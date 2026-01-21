import { makeWorld, addEntity, withComp } from "../engine/ecs.js";
import { CONFIG } from "./config.js";

export const initGame = () => {
  let w = makeWorld(123);

  const gameId = w.nextId;
  w = addEntity(w);
  w = withComp(w, "Game", gameId, {
    over: false,
    lives: 3,
    invuln: 0,
  });

  const pid = w.nextId;
  w = addEntity(w);
  w = withComp(w, "Position", pid, { x: CONFIG.world.w / 2, y: CONFIG.world.h - 60 });
  w = withComp(w, "Velocity", pid, { vx: 0, vy: 0 });
  w = withComp(w, "Sprite", pid, { kind: "circle", r: CONFIG.player.size, color: "#7cf3ff" });
  w = withComp(w, "Collider", pid, { shape: "circle", r: CONFIG.player.size });
  w = withComp(w, "PlayerControl", pid, {});

  const spid = w.nextId;
  w = addEntity(w);
  w = withComp(w, "Spawner", spid, { every: CONFIG.spawn.everySec, t: 0 });

  const sid = w.nextId;
  w = addEntity(w);
  w = withComp(w, "Score", sid, { value: 0 });

  return w;
};
