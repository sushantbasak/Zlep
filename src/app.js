const express = require('express');

const app = express();

const userRoute = require('./routes/userRoute');
const uploadRoute = require('./routes/uploadRoute');

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.get();

// API endpoints
app.use('/api/user', userRoute);
app.use('/api/upload', uploadRoute);

app.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`Server started successfully on port ${PORT}`)
);
