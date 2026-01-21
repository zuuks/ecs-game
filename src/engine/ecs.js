export const makeWorld = (seed = 1) => ({
  nextId: 1,
  seed,
  comps: {
    Position: new Map(),
    Velocity: new Map(),
    Sprite: new Map(),
    Collider: new Map(),
    PlayerControl: new Map(),
    Meteor: new Map(),
    Spawner: new Map(),
    Score: new Map(),
    Game: new Map(),
  },
  input: { keys: new Set(), mouse: { x: 0, y: 0, down: false, clicked: false } },
  events: [], 
});

export const addEntity = (world) => ({
  ...world,
  nextId: world.nextId + 1,
});

export const withComp = (world, type, id, data) => {
  const nextTypeMap = new Map(world.comps[type]);
  nextTypeMap.set(id, data);
  return {
    ...world,
    comps: { ...world.comps, [type]: nextTypeMap },
  };
};

export const removeEntity = (world, id) => {
  const nextComps = Object.fromEntries(
    Object.entries(world.comps).map(([t, mp]) => {
      const n = new Map(mp);
      n.delete(id);
      return [t, n];
    })
  );
  return { ...world, comps: nextComps };
};

export const get = (world, type, id) => world.comps[type].get(id);

export const has = (world, type, id) => world.comps[type].has(id);

export const idsWith = (world, ...types) => {
  if (types.length === 0) return [];
  const [first, ...rest] = types;
  const base = [...world.comps[first].keys()];
  return base.filter((id) => rest.every((t) => world.comps[t].has(id)));
};

export const runSystems = (systems, world, ctx) =>
  systems.reduce((w, sys) => sys(w, ctx), world);

export const rand01 = (seed) => {
  const a = 1664525, c = 1013904223, m = 2 ** 32;
  const next = (a * seed + c) % m;
  return { value: next / m, seed: next };
};

export const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
