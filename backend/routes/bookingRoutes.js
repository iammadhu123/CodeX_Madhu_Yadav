const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBooking,
  cancelBooking
} = require('../controllers/bookingController');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/my-jobs', protect, getProviderBookings);
router.route('/:id').put(protect, updateBooking).delete(protect, cancelBooking);

module.exports = router;
