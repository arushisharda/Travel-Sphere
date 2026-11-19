import { Router } from 'express';
import { z } from 'zod';
import { compareDestinations } from '../controllers/compare.controller.js';
import { validate } from '../middleware/validate.js';

const querySchema = z.object({ slugs: z.string().min(1).max(200) });
const router = Router();
router.get('/', validate({ query: querySchema }), compareDestinations);

export default router;
