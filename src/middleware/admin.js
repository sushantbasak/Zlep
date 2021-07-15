const { errorMessage, status } = require('../helpers/status');
const pool = require('../db/pool');

const adminAccess = (req, res, next) => {
  if (req.user.role === 0)
    return res.status(status.unauthorized).send({ status: 'error', msg: 'You dont have admin access' });

  next();
};

const rootAccess = async (req, res, next) => {
  if (req.user.role <= 1)
    return res.status(status.unauthorized).send({ status: 'error', msg: 'You dont have Root access' });

  const { userId } = req.params;

  const query = ` SELECT * 
  from users
  where user_id = $1;
  `;

  try {
    const findUser = await pool.query(query, [userId]);

    if (!findUser.rows.length)
      return res.status(status.bad).send({ ...errorMessage, msg: 'User requested for admin access not found' });

    next();
  } catch (e) {
    res.status(status.bad).send({ ...errorMessage, msg: 'Something terrible happened' });
  }
};

module.exports = { adminAccess, rootAccess };
