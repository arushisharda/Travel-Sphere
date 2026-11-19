import { Router } from 'express';
import { z } from 'zod';
import { getWeather, geocode } from '../controllers/weather.controller.js';
import { validate } from '../middleware/validate.js';

const weatherQuerySchema = z.object({
  destination: z.string().max(100).optional(),
  q: z.string().max(200).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
});

const geocodeQuerySchema = z.object({ q: z.string().min(1).max(200) });

const router = Router();
router.get('/geocode', validate({ query: geocodeQuerySchema }), geocode);
router.get('/', validate({ query: weatherQuerySchema }), getWeather);

export default router;
