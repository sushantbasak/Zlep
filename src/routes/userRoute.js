const express = require('express');

const router = express.Router();

const { createUser, getUser } = require('../controllers/user');

router.post('/register', createUser);

router.get('/alluser', getUser);

module.exports = router;
