const pool = require('../db/pool');
const { successMessage, status, errorMessage } = require('../helpers/status');

const createAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    const giveAccess = `UPDATE users
    SET role=1
    WHERE user_id = $1
    returning *;`;

    const access = await pool.query(giveAccess, [userId]);

    delete access.rows[0].password;

    res.status(status.created).send({ ...successMessage, data: access.rows[0] });
  } catch (e) {
    res.status(status.unauthorized).send({ ...errorMessage, msg: 'Unable to create Admin' });
  }
};

const revokeAdmin = async (req, res) => {
  const { userId } = req.params;

  const revokeQuery = `UPDATE users
    SET role = 0
    WHERE user_id = $1
    returning *;`;

  try {
    const revokeUser = await pool.query(revokeQuery, [userId]);

    if (!revokeUser.rows.length) return res.status(status.bad).send({ ...errorMessage, msg: 'User not found' });

    delete revokeUser.rows[0].password;

    res.status(status.success).send({ ...successMessage, data: revokeUser.rows[0] });
  } catch (e) {
    res.status(status.bad).send({ ...errorMessage, msg: 'Admin access not revoked' });
  }
};

module.exports = { createAdmin, revokeAdmin };
