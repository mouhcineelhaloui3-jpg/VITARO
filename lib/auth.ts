import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  password: z.string().min(8),
});

function resolveAuthSecret(): string | undefined {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV !== "production") {
    return "vitaro-dev-only-insecure-secret";
  }

  return undefined;
}

const authSecret = resolveAuthSecret();
const authUrl =
  process.env.NEXTAUTH_URL ??
  process.env.AUTH_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  useSecureCookies: authUrl?.startsWith("https://") ?? false,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin credentials",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
          return null;
        }

        if (parsed.data.password === adminPassword) {
          return {
            id: "admin",
            name: "Vitaro Admin",
            role: "ADMIN",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.role = "ADMIN";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.role = token.role as "ADMIN";
      }

      return session;
    },
  },
};
