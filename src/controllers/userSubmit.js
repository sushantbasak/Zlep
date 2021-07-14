const pool = require('../db/pool');
const { successMessage, errorMessage, status } = require('../helpers/status');

// =========================== Submit -> User/Student/Interviewee  ===========================

const getAllSubmit = async (req, res) => {
  const { user_id: userId } = req.user;

  const submitQuery = `
  select * from submits where user_id = $1`;

  try {
    const getAllSubmission = await pool.query(submitQuery, [userId]);

    if (getAllSubmission.rows.length === 0)
      return res.status(status.success).send({ ...successMessage, data: 'No Submissions found' });

    res.status(status.success).send({ ...successMessage, data: getAllSubmission.rows });
  } catch (e) {
    res.status(status.error).send({ ...errorMessage, msg: 'Unable to retrive User Submissions' });
  }
};

const createSubmit = async (req, res) => {
  const { submission } = req.body;

  const { user_id: userId } = req.user;

  const { uploadId } = req.params;

  const insertQuery = `
    Insert into submits(upload_id,user_id,submission)
    Values($1,$2,$3)
    returning *;`;
  const deleteQuery = `
    delete from submits where upload_id = $1 and user_id = $2
  `;

  try {
    await pool.query(deleteQuery, [uploadId, userId]);

    const submit = await pool.query(insertQuery, [uploadId, userId, submission]);

    if (!submit.rows.length) throw new Error();

    return res.status(status.created).send({ ...successMessage, data: submit.rows[0] });
  } catch (e) {
    return res.status(status.bad).send({ ...errorMessage, msg: 'Unable to Submit Assignment', e });
  }
};

const getSubmit = async (req, res) => {
  const { user_id: userId } = req.user;

  const { uploadId } = req.params;

  const submitQuery = `
  select * from submits where user_id = $1 and upload_id = $2`;

  try {
    const submissions = await pool.query(submitQuery, [userId, uploadId]);

    if (!submissions.rows.length)
      return res.status(status.notfound).send({ ...successMessage, data: 'No submissions found' });

    return res.status(status.success).send({ ...successMessage, data: submissions.rows });
  } catch (e) {
    res.status(status.bad).send({ ...errorMessage, msg: 'Unable to return Submitted Assignments' });
  }
};

const deleteSubmit = async (req, res) => {
  const { user_id: userId } = req.user;

  const { uploadId } = req.params;

  const deleteQuery = `
  delete from submits where user_id = $1 and upload_id = $2 returning *;`;

  try {
    const submissions = await pool.query(deleteQuery, [userId, uploadId]);

    if (!submissions.rows.length)
      return res.status(status.notfound).send({ ...successMessage, data: 'No submissions found' });

    return res.status(status.success).send({ ...successMessage, data: submissions.rows });
  } catch (e) {
    res.status(status.bad).send({ ...errorMessage, msg: 'Unable to return Submitted Assignments' });
  }
};

module.exports = { getSubmit, createSubmit, deleteSubmit, getAllSubmit };
