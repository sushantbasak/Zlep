const pool = require('../db/pool');
const { errorMessage, status } = require('./status');

const hostCheck = async (req, res, next) => {
  const { user_id: userId } = req.user;

  const { op, submitId } = req.params;

  let { uploadId } = req.params;

  const hostAccessQuery = `
        select * from uploads where upload_id = $1 and user_id = $2
    `;

  try {
    if (typeof uploadId === 'undefined') {
      const query = await pool.query('select upload_id from submits where submit_id = $1', [submitId]);

      uploadId = query.rows[0].upload_id;
    }

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
