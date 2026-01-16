import NextAuth from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|api/auth).*)",
  ],
};
