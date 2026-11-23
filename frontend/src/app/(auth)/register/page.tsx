import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const session = await auth();
  // Admins use this page to add users; everyone else who is signed in goes home.
  if (session?.user && session.user.role !== "ADMIN") redirect("/");
  return <RegisterForm />;
}
