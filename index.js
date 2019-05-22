const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const robot = require("robotjs");
const screenshot = require('screenshot-desktop');
const actions = require('./public/actions');

const serverPort = 3010;
const refreshTime = 500;
const mouseScroll = [ 0, 100 ]; // x, y

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  const stream = setInterval(() => {
    screenshot({format: 'png'}).then((img) => {
      socket.emit('TICK', {
        screen: img.toString('base64')
      });
    });
  }, refreshTime);

  socket.on(actions.MOUSE_MOVE, ({ x, y }) => {
    // TODO: x, y should be aware of viewport offset on screen
    robot.moveMouse(x, y);
  });

  socket.on(actions.CLICK, () => {        
    robot.mouseClick();
  });

  socket.on(actions.SCROLL, () => {           
    robot.scrollMouse(...mouseScroll);
  });

  socket.on(actions.TYPE, ({ key }) => {
    try {
      robot.keyTap(key.toLowerCase());
    } catch(error) {
      console.log(error);
    }
  });

  socket.on('disconnect', () => {
    clearInterval(stream);
  });
});

http.listen(serverPort, () => {
  console.log(`listening on *:${serverPort}`);
});
