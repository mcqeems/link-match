import { PrismaClient } from '@/generated/prisma';
import { auth } from './auth';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// Use this if you want to see delay
// function wait(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// Usage:
//   await wait(2000);

export async function fetchProfileInfo() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  const response = await prisma.profile.findUnique({
    where: { user_id: session.user.id },
    include: {
      User: {
        select: {
          roles: {
            select: { name: true },
          },
        },
      },
    },
  });

  return response;
}
