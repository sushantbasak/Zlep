const express = require('express');
const app = express();
const userRoute = require('./routes/userRoute');

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP' });
});

// API endpoints
app.use('/api', userRoute);

app.listen(3000, () =>
  console.log('Server started successfully on port ' + PORT)
);
