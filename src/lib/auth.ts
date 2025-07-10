import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

type AppUser = {
  id: string;
  email: string;
  name: string;
  role: string ;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
          },
        });

        if (!user || !user.password || !user.email) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        const appUser: AppUser = {
          id: user.id,
          email: user.email,
          name: user.name ?? "",
          role: user.role ?? "staff",
        };

        return appUser;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login?error=CredentialsSignin",
  },

  callbacks: {
  async jwt({ token, user }) {
    if (user && typeof (user as AppUser).role === "string") {
      token.role = (user as AppUser).role;
    }

    // 🔍 DEBUG: log token ที่ฝังลง JWT
    console.log("JWT Callback token:", token);

    return token;
  },
  async session({ session, token }) {
    if (typeof token.role === "string" && session.user) {
      session.user.role = token.role;
    }

    return session;
  },
},

  secret: process.env.NEXTAUTH_SECRET ?? "super-secret-7LS",
  debug: process.env.NODE_ENV === "development",
};
