// lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";
import { AuthOptions } from "next-auth";

export function getAuthOptions(): AuthOptions {
  return {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt",
    },
    callbacks: {
      session: async ({ session, token }) => {
        if (session?.user) {
          if (token.sub) {
            session.user.id = token.sub;
          }
        }
        return session;
      },
    },
  };
}