const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(3000, () =>
  console.log('Server started successfully on port ' + PORT)
);
