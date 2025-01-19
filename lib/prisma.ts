// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient;
    }
  }
}

const prisma = ((global as any) as NodeJS.Global).prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  (global as NodeJS.Global).prisma = prisma;
}

export default prisma;