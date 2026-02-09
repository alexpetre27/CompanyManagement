import { Microservice } from "./microservice";

export default interface Service {
  id: string;
  name: string;
  type: string;
  status: "operational" | "degraded" | "offline";
  latency: string;
}
export interface ServiceCardProps {
  service: Microservice;
  userRole: string | null;
}
export interface ServiceListProps {
  userRole: string;
}
