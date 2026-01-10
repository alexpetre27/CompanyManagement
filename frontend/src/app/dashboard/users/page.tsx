"use client";
import { useEffect, useState } from "react";
import { getUsers } from "@/services/user.service";
import { getProjects } from "@/services/project.service";
import { UserResponseDTO } from "@/types/user";
import { ProjectResponseDTO } from "@/types/project";
import { Table, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { Dialog } from "@/components/ui/dialog";

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [projects, setProjects] = useState<ProjectResponseDTO[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  useEffect(() => {
    getUsers().then(setUsers);
    getProjects().then(setProjects);
  }, []);

  const addUserToProject = async () => {
    if (!selectedUser || !selectedProject) return;
    await api.post(`/projects/${selectedProject}/add-user`, {
      userId: selectedUser,
    });
    alert("User added!");
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <Button onClick={() => setShowModal(true)}>Add User to Project</Button>
      <Table>
        <thead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Projects</TableCell>
          </TableRow>
        </thead>
        <tbody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.projects.map((p) => p.name).join(", ")}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        {showModal && (
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Add User to Project</h2>
            <select
              className="border p-2 w-full rounded"
              onChange={(e) => setSelectedUser(Number(e.target.value))}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </select>
            <select
              className="border p-2 w-full rounded"
              onChange={(e) => setSelectedProject(Number(e.target.value))}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <Button className="w-full" onClick={addUserToProject}>
              Add
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
