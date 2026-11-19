import { Router } from 'express';
import authRoutes from './auth.routes.js';
import destinationRoutes from './destinations.routes.js';
import weatherRoutes from './weather.routes.js';
import currencyRoutes from './currency.routes.js';
import cultureRoutes from './culture.routes.js';
import compareRoutes from './compare.routes.js';
import tripRoutes from './trips.routes.js';
import itineraryRoutes from './itinerary.routes.js';
import wishlistRoutes from './wishlist.routes.js';
import passportRoutes from './passport.routes.js';
import dnaRoutes from './dna.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/destinations', destinationRoutes);
router.use('/weather', weatherRoutes);
router.use('/currency', currencyRoutes);
router.use('/culture', cultureRoutes);
router.use('/compare', compareRoutes);
router.use('/trips', tripRoutes);
router.use('/itinerary', itineraryRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/passport', passportRoutes);
router.use('/dna', dnaRoutes);

export { router as routes };
