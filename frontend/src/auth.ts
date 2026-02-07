import NextAuth, { type DefaultSession } from "next-auth";
import { type JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// --- 1. EXTINDEM TIPURILE TYPESCRIPT ---
// Asta ne ajuta sa nu avem erori cand scriem session.user.role sau session.accessToken
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

// --- 2. CONFIGURARE ADMIN ---
// Lista de email-uri care primesc automat rolul de ADMIN cand intra cu Google
const ADMIN_EMAILS = ["petrealexandru1152@gmail.com"];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // PROVIDER 1: GOOGLE
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

    // PROVIDER 2: CREDENTIALS (Java Backend)
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
          });

          if (!res.ok) {
            console.error("Java Login Failed:", res.status, await res.text());
            return null;
          }

          const data = await res.json();

          // Returnam obiectul user catre NextAuth
          return {
            id: data.username, // NextAuth cere un ID
            name: data.username,
            username: data.username,
            email: credentials?.identifier as string,
            token: data.token, // Token-ul JWT de la Java
            role: data.role,
          };
        } catch (e) {
          console.error("Auth Connection Error:", e);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt", // Obligatoriu pentru credentials
    maxAge: 30 * 24 * 60 * 60, // 30 zile
  },

  callbacks: {
    // --- CALLBACK 1: JWT (Se executa cand se creeaza/actualizeaza tokenul) ---
    async jwt({ token, user, account, profile }) {
      // SCENARIUL A: Login cu User/Parola (Java)
      if (user) {
        // Daca avem user, inseamna ca tocmai ne-am logat
        token.accessToken = user.token; // Luam token-ul de Java
        token.username = user.username;
        token.role = user.role;
      }

      // SCENARIUL B: Login cu Google
      if (account && account.provider === "google") {
        // La Google nu primim token de Java, asa ca folosim tokenul de Google temporar
        // sau il lasam gol, dar setam ROLUL manual.
        token.accessToken = account.access_token;

        const email = profile?.email || token.email;

        // VERIFICARE ADMIN HARDCODAT
        if (email && ADMIN_EMAILS.includes(email)) {
          token.role = "ROLE_ADMIN";
        } else {
          token.role = "USER";
        }
      }

      return token;
    },

    // --- CALLBACK 2: SESSION (Se executa cand frontend-ul cere datele) ---
    async session({ session, token }) {
      // Transferam datele din Token-ul criptat in Sesiunea vizibila in browser
      session.accessToken = token.accessToken as string;

      if (session.user) {
        session.user.username =
          (token.username as string) || session.user.name || "";
        session.user.role = (token.role as string) || "USER";

        // Fix pentru email daca lipseste
        if (!session.user.email && token.email) {
          session.user.email = token.email;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // Pagina noastra custom de login
  },

  secret: process.env.AUTH_SECRET, // Cheia secreta din .env
});
