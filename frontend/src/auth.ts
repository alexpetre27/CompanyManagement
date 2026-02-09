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
      avatar?: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    username?: string;
    token?: string;
    role?: string;
    avatar?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    username?: string;
    role?: string;
    avatar?: string | null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username/Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const apiUrl =
          process.env.INTERNAL_API_URL || "http://backend:8080/api";

        try {
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials?.identifier,
              password: credentials?.password,
            }),
            cache: "no-store",
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();

          return {
            id: data.username,
            name: data.username,
            username: data.username,
            email: data.email,
            token: data.token,
            role: data.role,
            avatar: data.avatar,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.accessToken = user.token;
        token.username = user.username;
        token.role = user.role;
        token.avatar = user.avatar;
      }

      if (account && account.provider === "google") {
        const apiUrl =
          process.env.INTERNAL_API_URL || "http://backend:8080/api";

        try {
          const res = await fetch(`${apiUrl}/auth/social`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile?.email,
              username: profile?.name || profile?.email?.split("@")[0],
              avatar: profile?.picture,
            }),
            cache: "no-store",
          });

          if (res.ok) {
            const javaData = await res.json();
            token.accessToken = javaData.token;
            token.username = javaData.username;
            token.role = javaData.role;
            token.avatar = javaData.avatar;
          }
        } catch (error) {
          console.error(error);
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
        session.user.avatar = (token.avatar as string) || null;

        if (!session.user.email && token.email) {
          session.user.email = token.email;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.AUTH_SECRET,
});
