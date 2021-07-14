const pool = require('../db/pool');
const { errorMessage, status } = require('./status');

const hostCheck = async (req, res, next) => {
  const { user_id: userId } = req.user;

  const { id: uploadId, op } = req.params;

  const hostAccessQuery = `
        select * from uploads where upload_id = $1 and user_id = $2
    `;

  try {
    const findHost = await pool.query(hostAccessQuery, [uploadId, userId]);

    if (findHost.rows.length === 0) throw new Error();

    req.user = { ...req.user, uploadId, op };

    next();
  } catch (e) {
    res.status(status.unauthorized).send({
      ...errorMessage,
      msg: `Unable to perform ${req.method} operation on ${req.path}`,
    });
  }
};

module.exports = { hostCheck };
