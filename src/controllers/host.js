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
    } else throw new Error();
  } catch (e) {
    res.status(status.error).send({ ...errorMessage, msg: 'Not able to retrieve all submissions' });
  }
};

const giveReview = async (req, res) => {
  const { review, marks } = req.body;

  const { submitId } = req.params;

  const updateReviewQuery = `UPDATE submits
  set review = $1, marks = $2 
  where submit_id = $3
  returning *;`;

  try {
    const submitReview = await pool.query(updateReviewQuery, [review, marks, submitId]);

    if (!submitReview.rows.length) throw new Error();

    res.status(status.success).send({ ...successMessage, data: submitReview.rows[0] });
  } catch (e) {
    res.status(status.error).send({ ...errorMessage, msg: 'Unable to Add Review', e });
  }
};

module.exports = { getAllSubmissions, giveReview };
