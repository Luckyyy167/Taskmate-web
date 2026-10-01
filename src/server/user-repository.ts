import prisma from '@/lib/db';
import type { User } from '@/types';

interface DbUser extends User {
  password_hash: string;
}

function enrichUser(user: any) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    password_hash: user.passwordHash,
  };
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  return enrichUser(user) as DbUser | null;
}

export async function findUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return enrichUser(user) as User | null;
}

export async function createUser(params: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<User> {
  const user = await prisma.user.create({
    data: {
      name: params.name.trim(),
      email: params.email.toLowerCase().trim(),
      passwordHash: params.passwordHash,
    },
  });
  return enrichUser(user) as User;
}

export async function updateUserName(id: string, name: string): Promise<User | null> {
  const user = await prisma.user.update({
    where: { id },
    data: { name: name.trim() },
  });
  return enrichUser(user) as User | null;
}

export async function getUserPasswordHash(id: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { passwordHash: true },
  });
  return user?.passwordHash ?? null;
}

export async function findUserByEmailWithPassword(email: string): Promise<DbUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  return enrichUser(user) as DbUser | null;
}
