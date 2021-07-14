const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const pool = require('../db/pool');

const { successMessage, errorMessage, status } = require('../helpers/status');

dotenv.config();

const generateHash = async (password) => {
  const hash = await bcrypt.hash(password, +process.env.SALTROUND);

  return hash;
};

const compareHash = async (req, res, next) => {
  try {
    const user = await pool.query('select * from users where email = $1', [req.body.email]);

    if (!user.rows.length) return res.status(status.bad).send({ ...successMessage, msg: 'User not found' });

    const isMatch = await bcrypt.compare(req.body.password, user.rows[0].password);

    if (!isMatch) throw new Error();

    delete user.rows[0].password;

    req.user = user.rows[0];

    next();
  } catch (e) {
    return res.status(status.bad).send({ ...errorMessage, msg: 'Password not Matched' });
  }
};

module.exports = { generateHash, compareHash };
