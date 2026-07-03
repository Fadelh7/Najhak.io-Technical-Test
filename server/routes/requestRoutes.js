const express = require('express');
const {
  createRequest,
  getRequests,
  updateRequestStatus,
  getRequestStats,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/stats')
  .get(protect, getRequestStats);

router.route('/')
  .post(protect, createRequest)
  .get(protect, getRequests);

router.route('/:id/status')
  .patch(protect, updateRequestStatus);

module.exports = router;
