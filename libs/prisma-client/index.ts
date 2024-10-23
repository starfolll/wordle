import { Prisma, PrismaClient } from '@prisma/client'
import prismaRandom from 'prisma-extension-random'

export * from '@prisma/client'

export const prismaClient = new PrismaClient()
  .$extends(prismaRandom())

export async function prismaHealthCheck() {
  try {
    await prismaClient.$queryRaw`SELECT 1`
    return { connected: true }
  }
  catch (e) {
    return { error: e }
  }
}

export async function nullIfKnownError<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise
  }
  catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025')
      return null
    throw e
  }
}
