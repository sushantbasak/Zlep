const express = require('express');

const { auth } = require('../helpers/auth');

const router = express.Router();

const { getSubmit, createSubmit, deleteSubmit, getAllSubmit } = require('../controllers/userSubmit');

router.get('/me', auth, getAllSubmit);

router.post('/me/:uploadId', auth, createSubmit);

router.get('/me/:uploadId', auth, getSubmit);

router.delete('/me/:uploadId', auth, deleteSubmit);

module.exports = router;
