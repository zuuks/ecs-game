export const movementSystem = (world, ctx) => {
  const ids = [...world.comps.Velocity.keys()].filter((id) => world.comps.Position.has(id));

  const nextPos = ids.reduce((mp, id) => {
    const p = world.comps.Position.get(id);
    const v = world.comps.Velocity.get(id);
    mp.set(id, { x: p.x + v.vx * ctx.dt, y: p.y + v.vy * ctx.dt });
    return mp;
  }, new Map(world.comps.Position));

  return { ...world, comps: { ...world.comps, Position: nextPos } };
};
