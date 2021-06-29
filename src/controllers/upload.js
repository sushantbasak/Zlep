const pool = require('../db/pool');

const createUpload = async (req, res) => {
  const { projectName, description } = req.body;

  const uploadQuery = `
  INSERT INTO UPLOADS(user_id,project_name,description) VALUES($1,$2,$3) returning *;`;

  try {
    const upload = await pool.query(uploadQuery, [req.user.user_id, projectName, description]);

    if (upload.rows.length === 0) throw new Error('Unable to Insert');

    res.send(upload.rows[0]);
  } catch (e) {
    res.send('Unable to upload');
  }
};

const getUploadAll = async (req, res) => {
  const uploadQuery = `
  select upload_id,project_name from uploads where user_id = $1`;
  try {
    const uploads = await pool.query(uploadQuery, [req.user.user_id]);

    return res.send(uploads.rows);
  } catch (e) {
    return res.status(400).send('Error Found');
  }
};

const deleteUploadAll = async (req, res) => {
  const uploadQuery = `
  delete from uploads where user_id = $1 returning *;`;

  try {
    const uploads = await pool.query(uploadQuery, [req.user.user_id]);

    if (uploads.rows.length === 0) return res.send('No Uploads were Posted by User');

    return res.send(uploads.rows);
  } catch (e) {
    return res.status(400).send('Error Found');
  }
};

const viewUpload = async (req, res) => {
  const uploadQuery = `
  select * from uploads where upload_id = $1`;
  try {
    const upload = await pool.query(uploadQuery, [req.params.id]);

    if (upload.rows.length === 0) throw new Error();

    res.send(upload.rows[0]);
  } catch (e) {
    res.send('Unable to view Upload');
  }
};

const deleteUpload = async (req, res) => {
  const uploadQuery = `
  delete from uploads where upload_id = $1 and user_id = $2 returning *;`;

  try {
    const upload = await pool.query(uploadQuery, [req.params.id, req.user.user_id]);

    if (upload.rows.length === 0) throw new Error();

    res.send(upload.rows[0]);
  } catch (e) {
    res.send('Unable to Delete the Upload');
  }
};

const updateUpload = async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ['projectName', 'description'];

  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Update operation' });
  }

  updates.forEach((data) => {
    req.user[data] = req.body[data];
  });

  const uploadQuery = `
  update uploads
  set project_name = $3, description = $4
  where upload_id = $1 and user_id = $2
  returning *;`;

  try {
    const upload = await pool.query(uploadQuery, [
      req.params.id,
      req.user.user_id,
      req.user.projectName,
      req.body.description,
    ]);

    if (upload.rows.length === 0) throw new Error();

    res.send(upload.rows[0]);
  } catch (e) {
    res.send('Unable to Update the Upload');
  }
};

module.exports = { getUploadAll, createUpload, deleteUploadAll, viewUpload, deleteUpload, updateUpload };
