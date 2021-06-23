const express = require('express');
const { validUser } = require('../helpers/validation');

const router = express.Router();

const { createUser, getUser } = require('../controllers/user');

router.post('/register', validUser, createUser);

router.get('/alluser', validUser, getUser);

module.exports = router;
