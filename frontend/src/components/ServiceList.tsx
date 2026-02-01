"use client";

import useSWR from "swr";
import { Microservice } from "@/types/microservice";
import { ServiceCard } from "./ServiceCard";
import { ServiceCardSkeleton } from "./ServiceCardSkeleton";
import { getMicroservices } from "@/lib/api";

interface ServiceListProps {
  userRole: string;
}

export default function ServiceList({ userRole }: ServiceListProps) {
  const { data, error, isLoading } = useSWR<Microservice[]>(
    "microservices",
    getMicroservices,
    { refreshInterval: 5000 },
  );

  if (error) {
    return (
      <div className="text-red-500 font-medium p-4 border border-red-200 rounded-lg bg-red-50">
        Error loading services. Please try again later.
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((service) => (
        <ServiceCard key={service.id} service={service} userRole={userRole} />
      ))}
    </div>
  );
}
