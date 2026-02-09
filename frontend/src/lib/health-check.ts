import { MONITORING_CONFIG } from "@/config/monitoring";

export interface ServiceHealth {
  id: string;
  name: string;
  type: string;
  status: "operational" | "degraded" | "downtime";
  uptime: string;
  latency: string;
}

export async function checkSpringBootBackend(): Promise<ServiceHealth[]> {
  const start = performance.now();
  const results: ServiceHealth[] = [];
  const url = `${MONITORING_CONFIG.springBootUrl}/actuator/health`;

  try {
    console.log(`[Health Check] Încerc conectare la: ${url}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    console.log(`[Health Check] Răspuns status: ${res.status}`);
    if (!res.ok) throw new Error(`Status code ${res.status}`);
    clearTimeout(timeoutId);
    const end = performance.now();
    const latency = Math.round(end - start);

    const data = await res.json();

    results.push({
      id: "spring-backend",
      name: "Spring Boot API",
      type: "Core Backend",
      status: data.status === "UP" ? "operational" : "downtime",
      uptime: data.status === "UP" ? "100%" : "0%",
      latency: `${latency}ms`,
    });

    if (data.components && data.components.db) {
      results.push({
        id: "postgres-db",
        name: "PostgreSQL Database",
        type: "Database",
        status: data.components.db.status === "UP" ? "operational" : "downtime",
        uptime: "100%",
        latency: "Internal",
      });
    }

    return results;
  } catch (error) {
    console.error("EROARE CRITICĂ MONITORIZARE:", error);
    console.error("Spring Boot Unreachable:", error);
    return [
      {
        id: "spring-backend",
        name: "Spring Boot API",
        type: "Core Backend",
        status: "downtime",
        uptime: "0%",
        latency: "-",
      },
      {
        id: "postgres-db",
        name: "PostgreSQL Database",
        type: "Database",
        status: "downtime",
        uptime: "0%",
        latency: "-",
      },
    ];
  }
}

export async function checkExternalUrl(service: {
  id: string;
  name: string;
  type: string;
  url: string;
}): Promise<ServiceHealth> {
  const start = performance.now();
  try {
    const res = await fetch(service.url, {
      method: "HEAD",
      signal: AbortSignal.timeout(3000),
    });
    const end = performance.now();
    return {
      id: service.id,
      name: service.name,
      type: service.type,
      status: res.ok ? "operational" : "downtime",
      uptime: res.ok ? "100%" : "0%",
      latency: `${Math.round(end - start)}ms`,
    };
  } catch {
    return {
      id: service.id,
      name: service.name,
      type: service.type,
      status: "downtime",
      uptime: "0%",
      latency: "-",
    };
  }
}
