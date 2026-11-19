import { Router } from 'express';
import { convertQuerySchema } from '@travelsphere/shared';
import { convertCurrency, getSupportedCurrencies } from '../controllers/currency.controller.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.get('/supported', getSupportedCurrencies);
router.get('/convert', validate({ query: convertQuerySchema }), convertCurrency);

export default router;
