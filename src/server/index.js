const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.json('Welcome to battle ship!')
});

io.on('connection', function (socket) {
  console.log('a user socket connected!');
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
