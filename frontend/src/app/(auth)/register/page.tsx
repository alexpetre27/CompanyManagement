"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Parolele nu coincid!");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Cont creat cu succes! Te poți autentifica.");
      router.push("/login");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error as Error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 mb-4">
            <Building2 className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Join our team today</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Username
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  placeholder="nume_utilizator"
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  placeholder="nume@companie.ro"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  size={18}
                />
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  size={18}
                />
                <input
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Register Now
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-600 font-bold hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
