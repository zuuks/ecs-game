export const invulnSystem = (world, ctx) => {
  const game = world.comps.Game.get(1);
  if (!game || game.over) return world;
  if (game.invuln <= 0) return world;

  const nextGame = new Map(world.comps.Game);
  nextGame.set(1, { ...game, invuln: Math.max(0, game.invuln - ctx.dt) });

  return { ...world, comps: { ...world.comps, Game: nextGame } };
};
