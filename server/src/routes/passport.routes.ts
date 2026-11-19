import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getPassport, addStamp, removeStamp } from '../controllers/passport.controller.js';

const router = Router();
router.use(requireAuth);
router.get('/', getPassport);
router.post('/', addStamp);
router.delete('/:id', removeStamp);

export default router;
