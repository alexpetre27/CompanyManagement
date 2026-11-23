import NextAuth, { type DefaultSession } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
// Makes the "next-auth/jwt" module resolvable for the augmentation below.
export type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      username?: string;
      role?: string;
      avatar?: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    username?: string;
    token?: string;
    role?: string;
    avatar?: string | null;
    expiresInMs?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
    username?: string;
    role?: string;
    avatar?: string | null;
  }
}

const API_URL = process.env.INTERNAL_API_URL || "http://localhost:8080/api";
const DEFAULT_TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;

interface BackendLoginResponse {
  token: string;
  expiresInMs?: number;
  username: string;
  email: string;
  role: string;
  avatar: string | null;
}

export const isGoogleAuthEnabled = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

const providers: Provider[] = [
  Credentials({
    name: "Credentials",
    credentials: {
      identifier: { label: "Username/Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: credentials?.identifier,
            password: credentials?.password,
          }),
          cache: "no-store",
        });
        if (!res.ok) return null;

        const data: BackendLoginResponse = await res.json();
        return {
          id: data.username,
          name: data.username,
          username: data.username,
          email: data.email,
          token: data.token,
          expiresInMs: data.expiresInMs,
          role: data.role,
          avatar: data.avatar,
        };
      } catch (error) {
        console.error("Login request to backend failed", error);
        return null;
      }
    },
  }),
];

if (isGoogleAuthEnabled) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,

  session: {
    strategy: "jwt",
    // Never outlive the backend token (24h by default, see JWT_EXPIRATION_MS).
    maxAge: DEFAULT_TOKEN_LIFETIME_MS / 1000,
  },

  callbacks: {
    /**
     * For Google sign-ins, exchange the verified Google identity for a backend token.
     * The backend only accepts this call with the shared INTERNAL_API_SECRET.
     */
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return true;

      if (!profile?.email || profile.email_verified !== true) return false;
      const secret = process.env.INTERNAL_API_SECRET;
      if (!secret) {
        console.error("INTERNAL_API_SECRET is not set; Google sign-in is disabled.");
        return false;
      }

      try {
        const res = await fetch(`${API_URL}/auth/social`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Internal-Secret": secret,
          },
          body: JSON.stringify({
            email: profile.email,
            username: profile.name || profile.email.split("@")[0],
            avatar: profile.picture,
          }),
          cache: "no-store",
        });
        if (!res.ok) return false;

        const data: BackendLoginResponse = await res.json();
        Object.assign(user, {
          name: data.username,
          username: data.username,
          email: data.email,
          token: data.token,
          expiresInMs: data.expiresInMs,
          role: data.role,
          avatar: data.avatar,
        });
        return true;
      } catch (error) {
        console.error("Social login request to backend failed", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.accessTokenExpires =
          Date.now() + (user.expiresInMs ?? DEFAULT_TOKEN_LIFETIME_MS);
        token.username = user.username;
        token.role = user.role;
        token.avatar = user.avatar;
      }

      // Backend token expired: drop the session so the user is sent back to /login
      // instead of seeing empty pages.
      if (
        !token.accessToken ||
        (token.accessTokenExpires && Date.now() >= token.accessTokenExpires)
      ) {
        return null;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.username = token.username || session.user.name || "";
        session.user.role = token.role || "USER";
        session.user.avatar = token.avatar || null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.AUTH_SECRET,
});
