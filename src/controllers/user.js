const pool = require('../db/pool');

const { generateAuthToken } = require('../helpers/auth');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const users = await pool.query('insert into users(name,email,password) values($1,$2,$3) returning *;', [
      name,
      email,
      password,
    ]);

    if (users.rows.length === 0) throw new Error();

    return res.send(users.rows[0]);
  } catch (e) {
    return res.status(400).send('Error Found', e);
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await pool.query('select * from users where user_id = $1', [req.finduser.user_id]);

    if (!user.rows.length) throw new Error();

    delete user.rows[0].password;

    res.send({ user: user.rows[0], token: req.token });
  } catch (e) {
    res.send('User not registered', e);
  }
};

const deleteUser = async (req, res) => {
  pool
    .query('delete from users where user_id = $1 returning *;', [req.finduser.user_id])
    .then((user) => {
      if (!user.rows.length) throw new Error();

      res.send({ msg: 'User deleted successfully', user: user.rows[0] });
    })
    .catch((e) => res.status(400).send('Error Found', e));
};

const updateUser = (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ['name', 'age', 'email', 'password'];

  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Update operation' });
  }

  res.send(req.user);
};

const loginUser = async (req, res) => {
  try {
    const user = await pool.query('select * from users where email = $1', [req.body.email]);

    if (user.rows.length === 0) throw new Error('Error Found');

    const token = await generateAuthToken(user.rows[0]);

    await pool.query('insert into tokens(user_id,token) values($1,$2)', [user.rows[0].user_id, token]);

    return res.json({ data: user.rows[0], token });
  } catch (e) {
    console.log(e);

    const err = JSON.stringify(e, Object.getOwnPropertyNames(e));

    res.status(400).send({ msg: 'Error Found', Error: err });
  }
};

const logoutUser = async (req, res) => {
  pool
    .query('delete from tokens where token = $1 returning *;', [req.token])
    .then((user) => {
      if (!user.rows.length) throw new Error('Error Found');

      res.send({ msg: 'Successful Delete Operation', user: user.rows[0] });
    })
    .catch(() => res.status(400).send('Error Found'));
};

const logoutAllUser = async (req, res) => {
  pool
    .query('delete from tokens where user_id = $1 returning *;', [req.finduser.user_id])
    .then((user) => {
      if (!user.rows.length) throw new Error();

      res.send({ msg: 'Successful Delete Operation' });
    })
    .catch((e) => res.status(400).send('Error Found', e));
};

module.exports = { createUser, deleteUser, updateUser, loginUser, userProfile, logoutUser, logoutAllUser };
