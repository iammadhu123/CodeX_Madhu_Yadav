const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getMyServices
} = require('../controllers/serviceController');

const router = express.Router();

router.route('/').get(getServices).post(protect, authorizeRoles('provider'), createService);
router.get('/my-services', protect, getMyServices);
router.route('/:id').get(getService).put(protect, updateService).delete(protect, deleteService);

module.exports = router;
