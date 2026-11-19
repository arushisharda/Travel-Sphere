import type { RequestHandler } from 'express';
import * as authService from '../services/auth.service.js';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.register(req.body.email, req.body.name, req.body.password);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const getMe: RequestHandler = async (req, res, next) => {
  try {
    const user = await authService.getUser(req.userId!);
    res.json({ user });
  } catch (e) {
    next(e);
  }
};

export const deleteMe: RequestHandler = async (req, res, next) => {
  try {
    await authService.deleteUser(req.userId!);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
