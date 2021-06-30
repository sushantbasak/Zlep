const express = require('express');

const app = express();

const userRoute = require('./routes/userRoute');
const uploadRoute = require('./routes/uploadRoute');

const PORT = process.env.PORT || 3000;

const end = (req, res) => {
  res.status(404).send('Page Not Found');
};

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Server is running!');
});

app.get('/api/health', (req, res) => {
  res.status(200).send({ status: 'UP' });
});

// API endpoints
app.use('/api/user', userRoute);
app.use('/api/upload', uploadRoute);
app.use(end);

app.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`Server started successfully on port ${PORT}`)
);
