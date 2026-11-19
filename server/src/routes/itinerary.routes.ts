import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimit.js';
import { draftItinerary } from '../controllers/itinerary.controller.js';
import { validate } from '../middleware/validate.js';
import { plannerInputSchema } from '@travelsphere/shared';

const router = Router();
router.post('/draft', requireAuth, aiLimiter, validate({ body: plannerInputSchema }), draftItinerary);

export default router;
