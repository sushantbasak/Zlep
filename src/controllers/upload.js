const pool = require('../db/pool');

const getUpload = async (req, res) => {
  try {
    const uploads = await pool.query('select * from uploads');

    res.send(uploads.rows);
  } catch (e) {
    return res.status(400).send('Error Found');
  }
};

module.exports = { getUpload };
