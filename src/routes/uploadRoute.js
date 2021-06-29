const express = require('express');
const { auth } = require('../helpers/auth');

const router = express.Router();

const {
  getUploadAll,
  createUpload,
  deleteUploadAll,
  deleteUpload,
  viewUpload,
  updateUpload,
} = require('../controllers/upload');

router.get('/all', auth, getUploadAll);

router.post('/me', auth, createUpload);

router.delete('/all', auth, deleteUploadAll);

router.delete('/me/:id', auth, deleteUpload);

router.get('/me/:id', auth, viewUpload);

router.patch('/me/:id', auth, updateUpload);

module.exports = router;
