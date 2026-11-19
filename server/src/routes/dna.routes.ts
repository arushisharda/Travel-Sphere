import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getPreferences, updatePreferences, resetPreferences, getSuggestions } from '../controllers/dna.controller.js';

const router = Router();
router.use(requireAuth);
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);
router.delete('/preferences', resetPreferences);
router.get('/suggestions', getSuggestions);

export default router;
