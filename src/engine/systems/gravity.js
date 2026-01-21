export const gravitySystem = (world, ctx) => {
  const ids = [...world.comps.Meteor.keys()].filter((id) => world.comps.Velocity.has(id));

  const nextVel = ids.reduce((mp, id) => {
    const v = world.comps.Velocity.get(id);
    mp.set(id, { ...v, vx: 0 });
    return mp;
  }, new Map(world.comps.Velocity));

  return { ...world, comps: { ...world.comps, Velocity: nextVel } };
};
