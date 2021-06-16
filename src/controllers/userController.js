const pool = require('../db/pool');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const users = await pool.query(
      'insert into users(name,email,password) values($1,$2,$3) returning *;',
      [name, email, password]
    );

    if (!users) throw new Error();

    res.send(users.rows);
  } catch (e) {
    return res.status(400).send('Error Found');
  }
};

const getUser = async (req, res) => {
  try {
    const users = await pool.query('select * from users');

    if (!users) throw new Error();

    res.send(users.rows);
  } catch (e) {
    return res.status(400).send('Error Found');
  }
};

module.exports = { createUser, getUser };
