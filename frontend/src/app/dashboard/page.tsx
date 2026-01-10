"use client";
import { useEffect, useState } from "react";
import { getUsers } from "@/services/user.service";
import { getProjects } from "@/services/project.service";
import { UserResponseDTO } from "@/types/user";
import { ProjectResponseDTO } from "@/types/project";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [projects, setProjects] = useState<ProjectResponseDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [usersRes, projectsRes] = await Promise.all([
        getUsers(),
        getProjects(),
      ]);
      setUsers(usersRes);
      setProjects(projectsRes);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <h2>Total Users</h2>
          <p className="text-3xl font-bold">{users.length}</p>
        </Card>
        <Card className="p-6 text-center">
          <h2>Total Projects</h2>
          <p className="text-3xl font-bold">{projects.length}</p>
        </Card>
        <Card className="p-6 text-center">
          <h2>Users per Project</h2>
          <ul>
            {projects.map((p) => (
              <li key={p.id}>
                {p.name} –{" "}
                {
                  users.filter((u) => u.projects.some((pr) => pr.id === p.id))
                    .length
                }{" "}
                users
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
