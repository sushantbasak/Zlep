const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const generateAuthToken = async (user) => {
  const token = await jwt.sign({ id: user.user_id, date: new Date() }, 'process.env.JWT_SECRET');

  return token;
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    const decoded = await jwt.verify(token, 'process.env.JWT_SECRET');

    const finduser = await pool.query('select * from tokens where user_id = $1 AND token = $2', [decoded.id, token]);

    if (!finduser) throw new Error();

    req.token = token;

    // eslint-disable-next-line prefer-destructuring
    req.finduser = finduser.rows[0];

    next();
  } catch (e) {
    res.send({ msg: 'Please Authenticate', e });
  }
};

module.exports = { generateAuthToken, auth };
