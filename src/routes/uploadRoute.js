const express = require('express');
const { validUpload } = require('../helpers/validation');
const { auth } = require('../middileware/auth');
const { hostCheck } = require('../middileware/host');

const router = express.Router();

const {
  getUploadAll,
  createUpload,
  deleteUploadAll,
  deleteUpload,
  viewUpload,
  updateUpload,
} = require('../controllers/upload');

const { getAllSubmissions } = require('../controllers/host');

router.get('/all', auth, getUploadAll);

router.post('/me', auth, validUpload, createUpload);

router.delete('/all', auth, deleteUploadAll);

router.delete('/me/:id', auth, deleteUpload);

router.get('/me/:id', auth, viewUpload);

router.patch('/me/:id', auth, validUpload, updateUpload);

// =========================== Retrieve all submitted Documents/Assignment ===========================

router.get('/me/:uploadId/:op?', auth, hostCheck, getAllSubmissions);

module.exports = router;
