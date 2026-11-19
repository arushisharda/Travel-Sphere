import { Router } from 'express';
import { z } from 'zod';
import { getCultureEntries } from '../controllers/culture.controller.js';
import { validate } from '../middleware/validate.js';

const querySchema = z.object({ topic: z.string().max(50).optional() });
const router = Router();
router.get('/:destinationSlug', validate({ query: querySchema }), getCultureEntries);

export default router;
