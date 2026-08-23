import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  getOrders,
  updateOrderStatus,
  getAdminAnalytics,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

router.route('/my-orders').get(protect, getMyOrders);
router.route('/track/:trackingNumber').get(trackOrder);
router.route('/analytics/overview').get(protect, admin, getAdminAnalytics);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;
