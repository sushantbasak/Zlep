const express = require('express');
const { validUser } = require('../helpers/validation');
const { auth } = require('../helpers/auth');

const router = express.Router();

const {
  createUser,
  loginUser,
  userProfile,
  logoutUser,
  logoutAllUser,
  deleteUser,
  updateUser,
} = require('../controllers/user');

router.post('/register', validUser, createUser);

router.get('/me', auth, userProfile);

router.delete('/me', auth, deleteUser);

router.patch('/me', validUser, auth, updateUser);

router.get('/login', validUser, loginUser);

router.post('/logout', auth, logoutUser);

router.post('/logoutall', auth, logoutAllUser);

module.exports = router;
