const express = require('express');
const dotenv = require('dotenv');

const app = express();

const userRoute = require('./routes/userRoute');
const uploadRoute = require('./routes/uploadRoute');
const submitRoute = require('./routes/submitRoute');

app.use(express.json());
dotenv.config();

const { PORT } = process.env;

const end = (req, res) => {
  res.status(404).send('Page Not Found');
};

app.get('/', (req, res) => {
  res.status(200).send('Server is running!');
});

app.get('/api/health', (req, res) => {
  res.status(200).send({ status: 'UP' });
});

// API endpoints
app.use('/api/user', userRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/submit', submitRoute);
app.use(end);

app.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`Server started successfully on port ${PORT}`)
);
