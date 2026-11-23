export interface MonitoredService {
  id: string;
  name: string;
  type: string;
  url: string;
}

export const MONITORING_CONFIG: {
  springBootUrl: string;
  externalServices: MonitoredService[];
} = {
  springBootUrl: process.env.SPRING_BOOT_API_URL || "http://localhost:8080",
  externalServices: [],
};
