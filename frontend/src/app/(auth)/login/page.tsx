"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Github,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faff] px-4">
      <div className="w-full max-w-[420px] animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#6366f1] rounded-2xl shadow-xl shadow-indigo-200 mb-5 transition-transform hover:scale-105 duration-300">
            <Building2 className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-[#1a1f36] tracking-tight">
            Welcome!
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">
            Login to access your dashboard.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[24px] shadow-xl shadow-slate-200/60 border border-white space-y-6">
          <div className="space-y-3">
            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 bg-[#24292F] hover:bg-[#24292F]/90 text-white font-bold py-3 rounded-xl shadow-md shadow-slate-900/10 active:scale-[0.98] transition-all duration-200 text-sm"
            >
              <Github size={18} />
              <span>Continue with GitHub</span>
            </button>

            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl shadow-sm active:scale-[0.98] transition-all duration-200 text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-3 text-slate-400 font-bold tracking-widest">
                Or with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div className="relative group">
                <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#6366f1] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-[#6366f1] outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#6366f1] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-[#6366f1] outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-1">
            <Link
              href="/register"
              className="text-xs font-bold text-slate-400 hover:text-[#6366f1] transition-colors"
            >
              Don't have an account?{" "}
              <span className="text-[#6366f1]">Register now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
