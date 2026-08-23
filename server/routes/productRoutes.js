import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductFilterMeta,
  getProductByIdOrSlug,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/featured').get(getFeaturedProducts);
router.route('/filters').get(getProductFilterMeta);

router.route('/:idOrSlug').get(getProductByIdOrSlug);

router.route('/:id/reviews').post(protect, createProductReview);

router.route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
