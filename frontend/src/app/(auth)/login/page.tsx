import { redirect } from "next/navigation";
import { auth, isGoogleAuthEnabled } from "@/auth";
import { LoginForm } from "@/components/auth/LoginForm";

const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "Sign-in was refused. Your account could not be linked.",
  Configuration: "Sign-in is misconfigured on the server.",
  CredentialsSignin: "Invalid credentials.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/");

  const { error } = await searchParams;
  const initialError = error
    ? ERROR_MESSAGES[error] ?? "Sign-in failed. Please try again."
    : undefined;

  return <LoginForm googleEnabled={isGoogleAuthEnabled} initialError={initialError} />;
}
