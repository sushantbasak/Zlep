const pool = require('../db/pool');

const { generateAuthToken } = require('../middleware/auth');

const { generateHash } = require('../middleware/hash');

const { successMessage, errorMessage, status } = require('../helpers/status');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const findUser = await pool.query('select * from users where email=$1', [email]);

    if (findUser.rows.length)
      return res.status(status.conflict).send({ ...errorMessage, msg: 'User already Registered' });

    const hashPassword = await generateHash(password);

    const users = await pool.query('insert into users(name,email,password) values($1,$2,$3) returning *;', [
      name,
      email,
      hashPassword,
    ]);

    if (users.rows.length === 0) throw new Error();

    delete users.rows[0].password;

    return res.status(status.created).send({ ...successMessage, data: users.rows[0] });
  } catch (e) {
    return res.status(status.bad).send({ ...errorMessage, msg: 'Unable to create User' });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await pool.query('select * from users where user_id = $1', [req.user.user_id]);

    if (!user.rows.length) throw new Error();

    delete user.rows[0].password;

    res.status(status.success).send({ ...successMessage, data: user.rows[0] });
  } catch (e) {
    res.status(status.notfound).send({ ...errorMessage, msg: 'User not Found' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await pool.query('delete from users where user_id = $1 returning *;', [req.user.user_id]);

    await pool.query('delete from tokens where user_id = $1', [req.user.user_id]);

    if (!user.rows.length) throw new Error();

    delete user.rows[0].password;

    res.status(status.success).send({ ...successMessage, data: user.rows[0] });
  } catch (e) {
    res.status(status.error).send({ ...errorMessage, msg: 'Unable to delete User' });
  }
};

const updateUser = async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ['name', 'email', 'password'];

  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(status.bad).send({ ...errorMessage, msg: 'Invalid Update operation' });
  }

  updates.forEach((data) => {
    req.user[data] = req.body[data];
  });

  const updateQuery = ` UPDATE users 
  SET name=$1, email=$2, password=$3 
  WHERE email = $2 
  returning *;`;

  try {
    const user = await pool.query(updateQuery, [req.user.name, req.user.email, req.user.password]);

    if (user.rows.length === 0) throw new Error();

    return res.status(status.success).send({ ...successMessage, data: user.rows[0] });
  } catch (e) {
    return res.status(status.error).send({ ...errorMessage, msg: 'Unable to update User' });
  }
};

const loginUser = async (req, res) => {
  try {
    const token = await generateAuthToken(req.user.user_id);

    await pool.query('insert into tokens(user_id,token) values($1,$2)', [req.user.user_id, token]);

    return res.status(status.success).send({ ...successMessage, data: req.user, token });
  } catch (e) {
    // const err = JSON.stringify(e, Object.getOwnPropertyNames(e));
    // Only console.log(err) works in this case if JSON stringify not used

    res.status(status.notfound).send({ ...errorMessage, msg: 'Unable to login' });
  }
};

const logoutUser = async (req, res) => {
  try {
    const user = await pool.query('delete from tokens where token = $1 returning *;', [req.token]);

    if (!user.rows.length) throw new Error();

    res.status(status.success).send({ ...successMessage });
  } catch (e) {
    res.status(status.bad).send({ ...errorMessage, msg: 'Unable to Logout' });
  }
};

const logoutAllUser = async (req, res) => {
  try {
    const user = await pool.query('delete from tokens where user_id = $1 returning *;', [req.user.user_id]);
    if (!user.rows.length) throw new Error();

    res.status(status.success).send({ ...successMessage });
  } catch (e) {
    res.status(status.bad).send({ ...errorMessage, msg: 'Unable to logout from all devices' });
  }
};

module.exports = { createUser, deleteUser, updateUser, loginUser, userProfile, logoutUser, logoutAllUser };
