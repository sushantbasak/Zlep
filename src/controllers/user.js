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

const loginUser = async (req, res) => {
  try {
    const user = await pool.query('select * from users where email = $1', [req.body.email]);

    if (user.rows.length === 0) throw new Error();

    const token = await generateAuthToken(user.rows[0]);

    await pool.query('insert into tokens(user_id,token) values($1,$2)', [user.rows[0].user_id, token]);

    return res.json({ data: user.rows[0], token });
  } catch (e) {
    return res.send('Error Found', e);
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

const logoutUser = async (req, res) => {
  pool
    .query('delete from tokens where token = $1 returning *;', [req.token])
    .then((user) => {
      if (!user.rows.length) throw new Error();

      res.send({ msg: 'Successful Delete Operation', user: user.rows[0] });
    })
    .catch((e) => res.send('Error Found', e));
};

const logoutAllUser = async (req, res) => {
  pool
    .query('delete from tokens where user_id = $1 returning *;', [req.finduser.user_id])
    .then((user) => {
      if (!user.rows.length) throw new Error();
      // let token;
      // Object.entries(user.rows).forEach((data) => {
      //   console.log(data);
      //   token.concat(data.token);
      // });
      // for (let i = 0; i < user.rows.length; i += 1) {
      //   token.concat(user.rows[i].token);
      //   // token += user.rows[i].token;
      //   console.log(user.rows[i].user_id);
      // }
      // console.log('Hello');
      res.send({ msg: 'Successful Delete Operation', tokens: user.rows });
    })
    .catch((e) => res.status(400).send('Error Found', e));
};

// const getUser = async (req, res) => {
//   try {
//     const users = await pool.query('select * from users');
//     if (users.rows.length === 0) return res.send('Not a single user registered');

//     return res.send(users.rows);
//   } catch (e) {
//     return res.status(400).send('Error Found', e);
//   }
// };

module.exports = { createUser, loginUser, userProfile, logoutUser, logoutAllUser };
