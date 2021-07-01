const express = require('express');

const router = express.Router();

const { getSubmit } = require('../controllers/submit');

router.get('/me', getSubmit);

module.exports = router;
