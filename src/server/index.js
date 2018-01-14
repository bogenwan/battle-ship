const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.json('Welcome to battle ship!')
});

app.listen(8080, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('listening at http://localhost:8080');
});
