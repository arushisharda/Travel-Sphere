import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';

const sign = (userId: string) =>
  jwt.sign({ sub: userId }, env.JWT_SECRET as jwt.Secret, { expiresIn: '7d' });

const publicUser = (u: { id: string; email: string; name: string }) => ({
  id: u.id,
  email: u.email,
  name: u.name,
});

export async function register(email: string, name: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) throw new AppError(409, 'EMAIL_TAKEN', 'An account with this email already exists');
  const passwordHash = await bcrypt.hash(password, env.BCRYPT_COST);
  const user = await prisma.user.create({
    data: { email: email.toLowerCase(), name, passwordHash },
  });
  return { user: publicUser(user), token: sign(user.id) };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!user || !ok) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
  }
  return { user: publicUser(user), token: sign(user.id) };
}

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, 'NOT_FOUND', 'User not found');
  return publicUser(user);
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
}
