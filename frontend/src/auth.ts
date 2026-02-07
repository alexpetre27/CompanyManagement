import NextAuth, { type DefaultSession } from "next-auth";
import { type JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      username?: string;
      role?: string;
    } & DefaultSession["user"];
  }
  interface User {
    username?: string;
    token?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    username?: string;
    role?: string;
  }
}

const ADMIN_EMAILS = ["petrealexandru1152@gmail.com"];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const apiUrl =
          process.env.INTERNAL_API_URL || "http://localhost:8080/api";
        try {
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials?.identifier,
              password: credentials?.password,
            }),
          });
          if (!res.ok) return null;
          const data = await res.json();
          return {
            id: data.username,
            name: data.username,
            username: data.username,
            token: data.token,
            role: data.role,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && account.provider === "google") {
        token.accessToken = account.access_token;

        const email = profile?.email || token.email;
        if (email && ADMIN_EMAILS.includes(email)) {
          token.role = "ROLE_ADMIN";
        } else {
          token.role = "USER";
        }
      }

      if (user) {
        if (user.token) {
          token.accessToken = user.token;
          token.username = user.username;
          token.role = user.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (session.user) {
        session.user.username =
          (token.username as string) || session.user.name || "";
        session.user.role = (token.role as string) || "USER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
