const express = require('express');

const { auth } = require('../middleware/auth');

const { hostCheck } = require('../middleware/host');

const router = express.Router();

const { getSubmit, createSubmit, deleteSubmit, getAllSubmit } = require('../controllers/userSubmit');

const { giveReview } = require('../controllers/host');

router.get('/me', auth, getAllSubmit);

router.post('/me/:uploadId', auth, createSubmit);

router.get('/me/:uploadId', auth, getSubmit);

router.delete('/me/:uploadId', auth, deleteSubmit);

//= ============= Host/Teacher/Interviewer Access to give review on submitted assignment by the students/Interviewee/ ===========

router.patch('/:submitId/:op?', auth, hostCheck, giveReview);

module.exports = router;
