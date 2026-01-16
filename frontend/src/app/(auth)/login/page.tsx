"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { Github, Building2, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-200 mb-6">
            <Building2 className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Management System
          </h1>
          <p className="text-slate-500 mt-3 font-medium">
            Connect to your account
          </p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all text-lg"
          >
            <Github size={24} />
            Continue with GitHub
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-semibold tracking-wider">
                Or
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all">
              <Mail size={20} className="text-slate-400" />
              Email Sign In
            </button>

            <Link
              href="/register"
              className="w-full flex items-center justify-center gap-2 py-4 text-indigo-600 font-bold hover:text-indigo-700 transition-colors group"
            >
              Create a new account
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
