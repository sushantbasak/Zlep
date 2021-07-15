const express = require('express');

const router = express.Router();

const { auth } = require('../middleware/auth');
const { adminAccess, rootAccess } = require('../middleware/admin');
const { getAdmin } = require('../controllers/admin');
const { createAdmin, revokeAdmin } = require('../controllers/rootAdmin');

// ==== Admin ====

router.get('/all', adminAccess, getAdmin);

// ==== Root Admin ====

router.patch('/:userId', auth, rootAccess, createAdmin);

router.delete('/:userId', auth, rootAccess, revokeAdmin);

module.exports = router;
