const express = require('express');
const { validUser } = require('../helpers/validation');
const { auth } = require('../helpers/auth');

const router = express.Router();

const { createUser, loginUser, userProfile } = require('../controllers/user');

router.post('/register', validUser, createUser);

router.get('/login', validUser, loginUser);

router.get('/me', auth, userProfile);

module.exports = router;
