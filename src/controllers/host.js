const pool = require('../db/pool');
const { successMessage, errorMessage, status } = require('../helpers/status');

const getAllSubmissions = async (req, res) => {
  const { uploadId, op } = req.user;

  const allSubmitQuery = `
        select * from submits where upload_id = $1;
    `;

  try {
    if (op === 'allsubmit') {
      const allSubmissions = await pool.query(allSubmitQuery, [uploadId]);

      if (allSubmissions.rows.length === 0)
        res.status(status.success).send({ ...successMessage, msg: 'No One has submitted the assignment' });

      res.status(status.success).send({ ...successMessage, data: allSubmissions.rows });
    }
  } catch (e) {
    res.status(status.error).send({ ...errorMessage, msg: 'Not able to retrieve all submissions' });
  }
};

module.exports = { getAllSubmissions };
