import { getMicroservices } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/ServiceCard";
import { Microservice } from "@/types/microservice";

export default async function DashboardPage() {
  const services: Microservice[] = await getMicroservices();

  return (
    <div className="flex flex-col gap-6 p-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Microservices Fleet
          </h1>
          <p className="text-muted-foreground">
            Monitorizarea în timp real a instanțelor active.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Sistem Sănătos
          </Badge>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} userRole={null} />
        ))}
      </div>
    </div>
  );
}
