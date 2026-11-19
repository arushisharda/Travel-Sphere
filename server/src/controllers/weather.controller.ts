import { z } from 'zod';
import { getJson } from '../lib/httpClient.js';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';
import type { RequestHandler } from 'express';

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Foggy with rime', 51: 'Light drizzle', 53: 'Drizzle',
  55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Rain showers',
  81: 'Rain showers', 82: 'Heavy showers', 85: 'Snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail',
};

const geocodingSchema = z.object({
  results: z.array(z.object({
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    country: z.string().optional(),
    admin1: z.string().optional(),
  })).optional(),
});

const forecastSchema = z.object({
  timezone: z.string(),
  current: z.object({
    temperature_2m: z.number(),
    relative_humidity_2m: z.number(),
    weather_code: z.number(),
    wind_speed_10m: z.number(),
  }),
  daily: z.object({
    time: z.array(z.string()),
    weather_code: z.array(z.number()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    precipitation_probability_max: z.array(z.number().nullable()),
  }),
});

const weatherCache = new Map<string, { data: unknown; expiry: number }>();

async function geocodePlaceInternal(q: string) {
  const url = `${env.OPEN_METEO_GEOCODING_URL}?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
  const data = await getJson(url, geocodingSchema);
  return (data.results ?? []).map((r) => ({
    name: r.name, country: r.country ?? null, admin1: r.admin1 ?? null,
    lat: r.latitude, lng: r.longitude,
  }));
}

async function fetchWeather(lat: number, lng: number, placeName: string, placeCountry?: string) {
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const cached = weatherCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) return cached.data;

  const url = `${env.OPEN_METEO_FORECAST_URL}?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto&temperature_unit=celsius&wind_speed_unit=kmh`;
  const data = await getJson(url, forecastSchema);

  const result = {
    place: { name: placeName, country: placeCountry ?? null, lat, lng },
    timezone: data.timezone,
    units: { temperature: '°C', wind: 'km/h', humidity: '%' },
    current: {
      temperature: Math.round(data.current.temperature_2m * 10) / 10,
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      weatherCode: data.current.weather_code,
      condition: WMO_CODES[data.current.weather_code] ?? 'Unknown',
    },
    daily: data.daily.time.map((date, i) => ({
      date,
      min: Math.round((data.daily.temperature_2m_min[i] ?? 0) * 10) / 10,
      max: Math.round((data.daily.temperature_2m_max[i] ?? 0) * 10) / 10,
      precipChance: data.daily.precipitation_probability_max[i] ?? null,
      weatherCode: data.daily.weather_code[i] ?? 0,
      condition: WMO_CODES[data.daily.weather_code[i] ?? 0] ?? 'Unknown',
    })),
    retrievedAt: new Date().toISOString(),
    isForecast: true as const,
  };

  weatherCache.set(cacheKey, { data: result, expiry: Date.now() + 10 * 60 * 1000 });
  return result;
}

export const getWeather: RequestHandler = async (req, res, next) => {
  try {
    const q = (req as any).validatedQuery as { destination?: string; q?: string; lat?: number; lng?: number };

    if (q.lat !== undefined && q.lng !== undefined) {
      const data = await fetchWeather(q.lat, q.lng, `${q.lat.toFixed(2)}, ${q.lng.toFixed(2)}`);
      return res.json(data);
    }

    if (q.destination) {
      const dest = await prisma.destination.findUnique({
        where: { slug: q.destination },
        select: { latitude: true, longitude: true, name: true, country: true },
      });
      if (!dest) throw new AppError(404, 'NOT_FOUND', 'Destination not found');
      const data = await fetchWeather(dest.latitude, dest.longitude, dest.name, dest.country);
      return res.json(data);
    }

    if (q.q) {
      const results = await geocodePlaceInternal(q.q);
      if (!results.length) throw new AppError(404, 'NOT_FOUND', 'Place not found. Try adding the country name.');
      const first = results[0]!;
      const data = await fetchWeather(first.lat, first.lng, first.name, first.country ?? undefined);
      return res.json(data);
    }

    throw new AppError(400, 'VALIDATION_ERROR', 'Provide destination, q, or lat/lng');
  } catch (e) { next(e); }
};

export const geocode: RequestHandler = async (req, res, next) => {
  try {
    const { q } = (req as any).validatedQuery as { q: string };
    const results = await geocodePlaceInternal(q);
    res.json(results);
  } catch (e) { next(e); }
};
