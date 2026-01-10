"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/services/user.service";
import { getProjects } from "@/services/project.service";
import { UserResponseDTO } from "@/types/user";
import { ProjectResponseDTO } from "@/types/project";

export default function DashboardPage() {
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [projects, setProjects] = useState<ProjectResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          getUsers(),
          getProjects(),
        ]);
        setUsers(usersRes);
        setProjects(projectsRes);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-4xl font-bold">{users.length}</p>
        </div>

        <div className="bg-white p-6 rounded shadow flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Total Projects</h2>
          <p className="text-4xl font-bold">{projects.length}</p>
        </div>

        <div className="bg-white p-6 rounded shadow flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Users per Project</h2>
          <ul className="text-center">
            {projects.map((project) => (
              <li key={project.id}>
                <span className="font-medium">{project.name}</span> –{" "}
                {
                  users.filter((u) =>
                    u.projects.some((p) => p.id === project.id)
                  ).length
                }{" "}
                users
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
