const pool = require('../db/pool');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const users = await pool.query('insert into users(name,email,password) values($1,$2,$3) returning *;', [
      name,
      email,
      password,
    ]);

    if (users.rows.length === 0) throw new Error();

    return res.send(users.rows);
  } catch (e) {
    return res.status(400).send('Error Found', e);
  }
};

const getUser = async (req, res) => {
  try {
    const users = await pool.query('select * from users');

    if (users.rows.length === 0) return res.send('Not a single user registered');

    return res.send(users.rows.length);
  } catch (e) {
    return res.status(400).send('Error Found', e);
  }
};

module.exports = { createUser, getUser };
