import type { RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schemas: { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema }): RequestHandler =>
  (req, _res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) (req as unknown as Record<string, unknown>)['validatedQuery'] = schemas.query.parse(req.query);
      if (schemas.params) (req as unknown as Record<string, unknown>)['validatedParams'] = schemas.params.parse(req.params);
      next();
    } catch (e) {
      next(e);
    }
  };
