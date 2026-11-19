import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getWishlist, addToWishlist, addToWishlistBySlug, removeFromWishlist } from '../controllers/wishlist.controller.js';

const router = Router();
router.use(requireAuth);
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.post('/:destinationSlug', addToWishlistBySlug);
router.delete('/:destinationSlug', removeFromWishlist);

export default router;
