const express = require('express');

const router = express.Router();

const { getUpload } = require('../controllers/upload');

router.get('/allupload', getUpload);

module.exports = router;
