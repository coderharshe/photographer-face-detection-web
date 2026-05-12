import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  try {
    return new PrismaClient()
  } catch (e) {
    console.warn("Failed to instantiate PrismaClient. This is expected during build if environment variables are missing.")
    return new Proxy({}, {
      get(target, prop) {
        if (prop === '$on' || prop === '$connect' || prop === '$disconnect') return () => Promise.resolve()
        return () => { throw new Error(`PrismaClient method called without a valid client`) }
      }
    }) as PrismaClient
  }
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
