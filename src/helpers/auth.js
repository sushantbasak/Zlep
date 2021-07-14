const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pool = require('../db/pool');
const { status, errorMessage } = require('./status');

dotenv.config();

const generateAuthToken = async (user) => {
  const token = await jwt.sign({ id: user, date: new Date().getTime() }, process.env.JWT_SECRET);

  return token;
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded, 'Hello');

    const finduser = await pool.query('select * from tokens where user_id = $1 AND token = $2', [decoded.id, token]);

    console.log(finduser);

    if (!finduser.rows.length === 0) throw new Error();

    req.token = token;

    const user = await pool.query('select * from users where user_id = $1', [finduser.rows[0].user_id]);

    if (!user.rows.length) throw new Error();

    // eslint-disable-next-line prefer-destructuring
    req.user = user.rows[0];

    next();
  } catch (e) {
    res.status(status.unauthorized).send({ ...errorMessage, msg: 'Please Authenticate' });
  }
};

module.exports = { generateAuthToken, auth };
