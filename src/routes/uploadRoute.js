const express = require('express');
const { auth } = require('../helpers/auth');

const router = express.Router();

const { getUploadAll, createUpload, deleteUploadAll } = require('../controllers/upload');

router.get('/all', auth, getUploadAll);

router.post('/me', auth, createUpload);

router.delete('/all', auth, deleteUploadAll);

module.exports = router;
