const screenId = 'screen';

document.body.addEventListener('mousemove', (e) => {
  const { x, y } = e;
  socket.emit(actions.MOUSE_MOVE, { x, y });
});

document.body.addEventListener('click', () => {
  socket.emit(actions.CLICK, {});
});

document.body.addEventListener('keyup', (e) => {
  socket.emit(actions.TYPE, { key: e.key });
});

socket.on(actions.TICK, ({ screen }) => {
  const prefix = 'data:image/png;base64,';
  const image = document.getElementById(screenId) || document.createElement('img');

  image.id = screenId;
  image.src = `${prefix}${screen}`;
  document.body.appendChild(image);
});
