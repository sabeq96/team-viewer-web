const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const robot = require("robotjs");
const screenshot = require('screenshot-desktop');

const actions = {
  MOUSE_MOVE: 'MOUSE_MOVE',
  CLICK: 'CLICK',
  TYPE: 'TYPE',
  TICK: 'TICK',
  SCROLL: 'SCROLL',
};

const serverPort = 3010;
const refreshTime = 500;
const mouseScroll = [ 0, 100 ]; // x, y

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  const stream = setInterval(async () => {
    socket.emit('TICK', { screen: await getScreen() });
  }, refreshTime);

  socket.on(actions.MOUSE_MOVE, ({ x, y }) => {
    robot.moveMouse(x, y);
  });

  socket.on(actions.CLICK, () => {        
    robot.mouseClick();
  });

  socket.on(actions.SCROLL, () => {           
    robot.scrollMouse(...mouseScroll);
  })

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

http.listen(serverPort, function() {
  console.log('listening on *:' + serverPort);
});

const getScreen = () => screenshot({format: 'png'}).then((img) => img.toString('base64'));
