"use client";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Activity, CheckCircle } from "lucide-react";

export default function DashboardOverview() {
  const user = useAuthStore((state) => state.user);
  const stats = [
    {
      name: "Total Users",
      value: "24",
      icon: Users,
      color: "text-blue-500",
    },
    {
      name: "Active Projects",
      value: user?.projectIds?.length.toString(),
      icon: Briefcase,
      color: "text-indigo-500",
    },
    {
      name: "Completed Tasks",
      value: "128",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      name: "Efficiency",
      value: "94%",
      icon: Activity,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, {user?.username}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Here's what's happening today in your company.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.name}
            className="border-none shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.name}
              </CardTitle>
              <stat.icon className={stat.color} size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Your Current Projects</h3>
        <div className="space-y-4">
          <p className="text-sm text-slate-400 italic">
            Loading recent projects...
          </p>
        </div>
      </div>
    </div>
  );
}
