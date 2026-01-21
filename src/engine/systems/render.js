import { CONFIG } from "../../game/config.js";

export const renderSystem = (world, ctx) => {
  const { g, hud } = ctx;

  g.clearRect(0, 0, CONFIG.world.w, CONFIG.world.h);

  

  for (const [id, spr] of world.comps.Sprite.entries()) {
    const p = world.comps.Position.get(id);
    if (!p) continue;

    const game = world.comps.Game.get(1);
    const isPlayer = world.comps.PlayerControl.has(id);
    if (isPlayer && game?.invuln > 0) {
      if (Math.floor(ctx.now / 100) % 2 === 0) continue;
    }


    g.save();
    g.fillStyle = spr.color ?? "#ffffff";

    if (spr.kind === "circle") {
      g.beginPath();
      g.arc(p.x, p.y, spr.r, 0, Math.PI * 2);
      g.fill();
    } else if (spr.kind === "rect") {
      g.fillRect(p.x - spr.w / 2, p.y - spr.h / 2, spr.w, spr.h);
    }

    g.restore();
  }

  const game = world.comps.Game.get(1);
  const scoreEnt = [...world.comps.Score.keys()][0];
  const score = scoreEnt ? world.comps.Score.get(scoreEnt)?.value ?? 0 : 0;

  const lives = game?.lives ?? 0;
  const over = game?.over ? "  —  IZGUBIO SI (klik za restart)" : "";

  hud.textContent = `Score: ${Math.floor(score)}   Zivoti: ${lives}${over}`;

  return world;
};
