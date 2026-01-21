import { removeEntity } from "../ecs.js";
import { CONFIG } from "../../game/config.js";

const dist2 = (a, b) => {
  const dx = a.x - b.x, dy = a.y - b.y;
  return dx * dx + dy * dy;
};

export const collisionSystem = (world) => {
  const gameId = 1;
  const game = world.comps.Game.get(gameId);
  if (!game || game.over) return world;

  const playerIds = [...world.comps.PlayerControl.keys()];
  if (playerIds.length === 0) return world;
  const pid = playerIds[0];

  const pPos = world.comps.Position.get(pid);
  const pCol = world.comps.Collider.get(pid);
  if (!pPos || !pCol) return world;

  const meteorIds = [...world.comps.Meteor.keys()];


  const toRemoveOffscreen = meteorIds.filter((id) => {
    const pos = world.comps.Position.get(id);
    const col = world.comps.Collider.get(id);
    return pos && col && (pos.y - col.r > CONFIG.world.h + 40);
  });

  let w1 = toRemoveOffscreen.reduce((acc, id) => removeEntity(acc, id), world);


  if ((game.invuln ?? 0) > 0) return w1;


  const hitId = meteorIds.find((id) => {
    const mPos = w1.comps.Position.get(id);
    const mCol = w1.comps.Collider.get(id);
    if (!mPos || !mCol) return false;
    const r = pCol.r + mCol.r;
    return dist2(pPos, mPos) <= r * r;
  });

  if (!hitId) return w1;

  w1 = removeEntity(w1, hitId);


  const livesNow = game.lives ?? 3;
  const livesLeft = livesNow - 1;

  const nextGame = new Map(w1.comps.Game);
  nextGame.set(gameId, {
    ...game,
    lives: livesLeft,
    invuln: 1.0,          
    over: livesLeft <= 0, 
  });

  return { ...w1, comps: { ...w1.comps, Game: nextGame } };
};
