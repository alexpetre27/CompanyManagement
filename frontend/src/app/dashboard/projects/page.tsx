"use client";
import { useEffect, useState } from "react";
import { getProjects } from "@/services/project.service";
import { ProjectResponseDTO } from "@/types/project";
import { Table, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { Dialog } from "@/components/ui/dialog";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectResponseDTO[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const addProject = async () => {
    if (!newProject) return;
    await api.post("/projects", { name: newProject });
    const updated = await getProjects();
    setProjects(updated);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Projects</h1>
      <div className="flex gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => setShowModal(true)}>Add Project</Button>
      </div>

      <Table>
        <thead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
          </TableRow>
        </thead>
        <tbody>
          {paginated.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.name}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <div className="flex gap-2 items-center">
        <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </Button>
        <span>
          {page} / {totalPages}
        </span>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-bold">Add Project</h2>
          <input
            className="border p-2 w-full rounded"
            placeholder="Project Name"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
          />
          <Button className="w-full" onClick={addProject}>
            Add
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
