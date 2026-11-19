import { Router } from 'express';
import { z } from 'zod';
import { listDestinations, getDestination, getMapDestinations } from '../controllers/destinations.controller.js';
import { validate } from '../middleware/validate.js';

const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  country: z.string().max(100).optional(),
  style: z.string().max(50).optional(),
  budget: z.coerce.number().int().min(1).max(5).optional(),
  climate: z.string().max(50).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

const router = Router();

router.get('/map', getMapDestinations);
router.get('/', validate({ query: listQuerySchema }), listDestinations);
router.get('/:slug', getDestination);

export default router;
