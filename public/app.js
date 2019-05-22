const screenDOM = document.getElementById('screen');

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
  screenDOM.setAttribute('src', prefix + screen);
});
