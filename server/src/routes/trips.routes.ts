import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  listTrips, createTrip, getTrip, updateTrip, deleteTrip,
  addItem, updateItem, deleteItem, regenerateDay,
} from '../controllers/trips.controller.js';

const router = Router();
router.use(requireAuth);
router.get('/', listTrips);
router.post('/', createTrip);
router.get('/:id', getTrip);
router.patch('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.post('/:id/items', addItem);
router.patch('/:id/items/:itemId', updateItem);
router.delete('/:id/items/:itemId', deleteItem);
router.post('/:id/regenerate-day', regenerateDay);

export default router;
