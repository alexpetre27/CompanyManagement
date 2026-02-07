export type ServiceStatus = "UP" | "DOWN" | "MAINTENANCE" | "STARTING";

export interface Microservice {
  id: number | string;
  name: string;
  status: ServiceStatus;
  url: string;
  port: number;
  uptime: string;
  version: string;
  lastCheck: string;
}
