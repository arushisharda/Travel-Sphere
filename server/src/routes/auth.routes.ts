import { Router } from 'express';
import { register, login, getMe, deleteMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { registerSchema, loginSchema } from '@travelsphere/shared';

const router = Router();

router.post('/register', authLimiter, validate({ body: registerSchema }), register);
router.post('/login', authLimiter, validate({ body: loginSchema }), login);
router.get('/me', requireAuth, getMe);
router.delete('/me', requireAuth, deleteMe);

export default router;
