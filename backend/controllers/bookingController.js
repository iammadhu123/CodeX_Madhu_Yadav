const Booking = require('../models/Booking');
const Service = require('../models/Service');
const asyncHandler = require('express-async-handler');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, date, time, location, notes } = req.body;

  console.log('Booking attempt - user:', req.user.id, 'role:', req.user.role, 'serviceId:', serviceId);
  const service = await Service.findById(serviceId).populate('provider');
  if (!service || !service.available) {
    res.status(400);
    throw new Error('Service not available');
  }

    if (!['user'].includes(req.user.role)) {
    res.status(403);
    throw new Error('Only customers can create bookings');
  }

  const existingBooking = await Booking.findOne({
    service: serviceId,
    customer: req.user.id,
    status: { $ne: 'cancelled' }
  });

  if (existingBooking) {
    res.status(400);
    throw new Error('You already have a booking for this service');
  }

  const booking = await Booking.create({
    service: serviceId,
    customer: req.user.id,
    provider: service.provider._id,
    date,
    time,
    location: location || service.location,
    notes,
    totalPrice: service.price
  });

  res.status(201).json({ success: true, data: booking });
});

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customer: req.user.id })
    .populate('service', 'title price')
    .populate('provider', 'name location')
    .sort('-createdAt');
  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Get provider bookings
// @route   GET /api/bookings/my-jobs
// @access  Private
const getProviderBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ provider: req.user.id })
    .populate('service', 'title price')
    .populate('customer', 'name location')
    .sort('-createdAt');
  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Update booking status (for provider)
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('service');
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.provider.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (req.body.status === 'completed') {
    booking.service.available = true;
    await booking.service.save();
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('service', 'title price').populate('customer', 'name');

  res.json({ success: true, data: updatedBooking });
});

// @desc    Cancel booking (customer only)
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('service');
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.customer.toString() !== req.user.id && booking.provider.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Restore service availability
  booking.service.available = true;
  await booking.service.save();

  await booking.remove();
  res.json({ success: true, message: 'Booking cancelled' });
});

module.exports = {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBooking,
  cancelBooking
};
