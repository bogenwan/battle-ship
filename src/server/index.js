const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.json('Welcome to battle ship!')
});

io.on('connection', function (socket) {
  console.log('a user socket connected!');

  socket.on('fire', (fireData) => {
    console.log(fireData);
    socket.broadcast.emit('fire', {
      fireData,
      from: socket.id.slice(8)
    });
  });


  socket.on('disconnect', function () {
    console.log('a user socket disconnected!');
  });
});

http.listen(8080, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('listening at http://localhost:8080');
});
