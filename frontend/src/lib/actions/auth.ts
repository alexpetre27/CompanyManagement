"use server";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { signIn, signOut } from "@/auth";

export const login = async () => {
  await signIn("github", { redirectTo: "/dashboard" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
