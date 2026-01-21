export const createInput = (targetEl = window) => {
  const queue = [];
  const onKeyDown = (e) => queue.push({ type: "keyDown", key: e.key });
  const onKeyUp = (e) => queue.push({ type: "keyUp", key: e.key });
  const onMouseMove = (e) => queue.push({ type: "mouseMove", x: e.clientX, y: e.clientY });
  const onMouseDown = () => queue.push({ type: "mouseDown" });
  const onMouseUp = () => queue.push({ type: "mouseUp" });
  const onClick = () => queue.push({ type: "click" });

  targetEl.addEventListener("keydown", onKeyDown);
  targetEl.addEventListener("keyup", onKeyUp);
  targetEl.addEventListener("mousemove", onMouseMove);
  targetEl.addEventListener("mousedown", onMouseDown);
  targetEl.addEventListener("mouseup", onMouseUp);
  targetEl.addEventListener("click", onClick);

  const pull = () => {
    const out = queue.slice();
    queue.length = 0;
    return out;
  };

  return { pull };
};

export const inputSystem = (world, ctx) => {
  const keys = new Set(world.input.keys);
  let mouse = { ...world.input.mouse, clicked: false };

  const next = ctx.events.reduce((acc, ev) => {
    if (ev.type === "keyDown") acc.keys.add(ev.key);
    if (ev.type === "keyUp") acc.keys.delete(ev.key);
    if (ev.type === "mouseMove") acc.mouse = { ...acc.mouse, x: ev.x, y: ev.y };
    if (ev.type === "mouseDown") acc.mouse = { ...acc.mouse, down: true };
    if (ev.type === "mouseUp") acc.mouse = { ...acc.mouse, down: false };
    if (ev.type === "click") acc.mouse = { ...acc.mouse, clicked: true };
    return acc;
  }, { keys, mouse });

  return { ...world, input: next, events: ctx.events };
};
