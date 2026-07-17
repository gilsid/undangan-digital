import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rateLimit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        // Defense-in-depth: rate-limit check di sini sebagai lapis kedua
        // (pesan error tidak akan sampai ke UI — itu ditangani oleh client endpoint)
        const forwarded = req?.headers?.get("x-forwarded-for");
        const ip = forwarded?.split(",")[0] ?? "127.0.0.1";
        if (await isRateLimited(`login:${ip}:${credentials.email}`, 10, 60000)) {
          throw new Error("RateLimited");
        }

        const email = credentials.email as string;
    const password = credentials.password as string;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);

        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});
