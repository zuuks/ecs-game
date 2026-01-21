export const scoreSystem = (world, ctx) => {
  const gameId = 1;
  const game = world.comps.Game.get(gameId);
  if (!game || game.over) return world;

  const scoreIds = [...world.comps.Score.keys()];
  if (scoreIds.length === 0) return world;
  const sid = scoreIds[0];

  const s = world.comps.Score.get(sid);
  const nextScore = new Map(world.comps.Score);
  nextScore.set(sid, { ...s, value: s.value + ctx.dt });

  return { ...world, comps: { ...world.comps, Score: nextScore } };
};
