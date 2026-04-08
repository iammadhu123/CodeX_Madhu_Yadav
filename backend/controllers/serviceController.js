const Service = require('../models/Service');
const asyncHandler = require('express-async-handler');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
    const title = req.query.title ? { title: { $regex: req.query.title, $options: 'i' } } : {};
  const category = req.query.category ? { category: { $regex: `^${req.query.category}$`, $options: 'i' } } : {};
  const location = req.query.location ? { location: { $regex: req.query.location, $options: 'i' } } : {};

  let services = await Service.find({ ...title, ...category, ...location })
    .populate('provider', 'name email location')
    .sort('-createdAt');

  if (req.query.keyword || req.query.search) {
    const searchValue = req.query.keyword || req.query.search;
    const keywordRegex = new RegExp(searchValue, 'i');
    services = services.filter((service) =>
      keywordRegex.test(service.title) ||
      keywordRegex.test(service.description) ||
      keywordRegex.test(service.location) ||
      keywordRegex.test(service.category) ||
      keywordRegex.test(service.provider?.name) ||
      keywordRegex.test(service.provider?.email)
    );
  }

  res.json({ success: true, count: services.length, data: services });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('provider', 'name email location phone');
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json({ success: true, data: service });
});

// @desc    Create service
// @route   POST /api/services
// @access  Private
const createService = asyncHandler(async (req, res) => {
  req.body.provider = req.user.id;
  if (!req.body.location) {
    req.body.location = req.user.location;
  }
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, data: service });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  if (service.provider.toString() !== req.user.id) {
    res.status(403);
    throw new Error('User not authorized');
  }

  const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, data: updatedService });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  if (service.provider.toString() !== req.user.id) {
    res.status(403);
    throw new Error('User not authorized');
  }

  await service.remove();
  res.json({ success: true, message: 'Service deleted' });
});

// @desc    Get user services
// @route   GET /api/services/my-services
// @access  Private
const getMyServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ provider: req.user.id }).populate('provider', 'name');
  res.json({ success: true, count: services.length, data: services });
});

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getMyServices
};
