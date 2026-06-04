import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const ip = getClientIp(request as unknown as Request);
        const { allowed } = await checkRateLimit("login", ip, 5, 15 * 60 * 1000);
        if (!allowed) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();
        if (!email.includes("@") || email.length > 254) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: { email },
        });

        if (!admin) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          admin.passwordHash || ""
        );

        if (!isValid) return null;

        return {
          id: admin.id,
          email: admin.email,
          name: admin.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  trustHost: true,
});
