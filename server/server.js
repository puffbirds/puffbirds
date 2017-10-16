const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const bodyParser = require('body-parser');
const app = express();
const socket = require('socket.io');


const todoController = require('./controllers/todoController');
const spaceController = require('./controllers/spaceController');


const compiler = webpack(webpackConfig);

console.log('__dirname', __dirname);

app.use(webpackDevMiddleware(compiler, {
  hot: true,
  filename: 'bundle.js',
  publicPath: '/',
  stats: {
    colors: true,
  },
  historyApiFallback: true,
}));

console.log('before ...ww');

app.use(express.static(__dirname + '../www'));

console.log('after ...ww')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Todo
app.get('/api/todo', todoController.getTodo);
app.post('/api/todo', todoController.addTodo);

//Space
app.get('/api/space', spaceController.getSpace);
app.post('/api/update/space', spaceController.updateSpace);
app.post('/api/clear/space', spaceController.clearSpace);


//Calendar
// /api/cal output in the form of
/*
[
  {
      "_id": 1,
      "month": 10,
      "day": 1,
      "events": ""
  },
  {
      "_id": 2,
      "month": 10,
      "day": 2,
      "events": ""
  },
  [...]
]
*/
app.get('/api/cal', (req, res, next) => {
  const results = [];
  pg.connect(connectionString, (err, client, done) => {
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err });
    }
    const query = client.query('SELECT * FROM "Cal";');
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

// socket.io stuff
const io = socket(server);
let mouseXPosArray = [];
let mouseYPosArray = [];
io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('new connection: ' + socket.id); // logs when new window is opened
  
  socket.on('mouse', mouseMsg); // listens for any 'mouse' event
  // calls this when 'mouse' event is heard
  function mouseMsg(mousePosition) {
    socket.broadcast.emit('mouse', mousePosition);
    // console.log(mousePosition);
    mouseXPosArray.push(mousePosition[0]);
    mouseYPosArray.push(mousePosition[1]);
    console.log(mouseXPosArray, mouseYPosArray);
  }
}