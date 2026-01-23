"use client";

import useSWR from "swr";
import { ServiceCard } from "./ServiceCard";
import { ServiceCardSkeleton } from "./ServiceCardSkeleton";
import { Microservice } from "@/types/microservice";

interface ServiceListProps {
  userRole: string | null;
}

export default function ServiceList({ userRole }: ServiceListProps) {
  const { data, error, isLoading } = useSWR<Microservice[]>(
    "http://localhost:8080/api/services",
    fetcher,
    { refreshInterval: 5000 },
  );

  if (error)
    return (
      <div className="text-red-500 font-medium p-4 border border-red-200 rounded-lg bg-red-50">
        Error loading services. Please try again later.
      </div>
    );

  if (isLoading)
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((service) => (
        <ServiceCard key={service.id} service={service} userRole={userRole} />
      ))}
    </div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());
