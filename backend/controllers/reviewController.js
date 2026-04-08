const Review = require('../models/Review');
const Service = require('../models/Service');
const asyncHandler = require('express-async-handler');

// Helper function to update service rating
const updateServiceRating = asyncHandler(async (serviceId) => {
  const reviews = await Review.find({ service: serviceId });
  
  if (reviews.length === 0) {
    await Service.findByIdAndUpdate(serviceId, { rating: 0 });
    return;
  }
  
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  await Service.findByIdAndUpdate(serviceId, { rating: averageRating });
});

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { service, rating, comment } = req.body;

  // Check if review already exists
  const existingReview = await Review.findOne({
    service,
    customer: req.user.id
  });

  if (existingReview) {
    res.status(400);
    throw new Error('Review already submitted');
  }

  const serviceDoc = await Service.findById(service);
  if (!serviceDoc) {
    res.status(404);
    throw new Error('Service not found');
  }

  const review = await Review.create({
    service,
    customer: req.user.id,
    provider: serviceDoc.provider,
    rating,
    comment
  });

  // Update service rating
  await updateServiceRating(service);

  res.status(201).json({ success: true, data: review });
});

// @desc    Get reviews for service
// @route   GET /api/reviews/:serviceId
// @access  Public
const getServiceReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ service: req.params.serviceId })
    .populate('customer', 'name')
    .sort('-createdAt');
  
  res.json({ success: true, count: reviews.length, data: reviews });
});

module.exports = {
  createReview,
  getServiceReviews
};
