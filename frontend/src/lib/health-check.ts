import { MONITORING_CONFIG } from "@/config/monitoring";

export interface ServiceHealth {
  id: string;
  name: string;
  type: string;
  status: "operational" | "degraded" | "downtime";
  uptime: string;
  latency: string;
}

const DOWN: Omit<ServiceHealth, "id" | "name" | "type"> = {
  status: "downtime",
  uptime: "0%",
  latency: "-",
};

export async function checkSpringBootBackend(): Promise<ServiceHealth[]> {
  const start = performance.now();
  const url = `${MONITORING_CONFIG.springBootUrl}/actuator/health`;

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    const latency = Math.round(performance.now() - start);

    // Spring answers 503 with a JSON body when a component (e.g. the DB) is down.
    const data = await res.json().catch(() => null);
    if (!data?.status) throw new Error(`Unexpected health response (HTTP ${res.status})`);

    const results: ServiceHealth[] = [
      {
        id: "spring-backend",
        name: "Spring Boot API",
        type: "Core Backend",
        status: data.status === "UP" ? "operational" : "degraded",
        uptime: data.status === "UP" ? "100%" : "0%",
        latency: `${latency}ms`,
      },
    ];

    const db = data.components?.db;
    results.push({
      id: "postgres-db",
      name: "PostgreSQL Database",
      type: "Database",
      ...(db?.status === "UP"
        ? { status: "operational" as const, uptime: "100%", latency: "Internal" }
        : DOWN),
    });

    return results;
  } catch (error) {
    console.error(`Health check failed for ${url}:`, error);
    return [
      { id: "spring-backend", name: "Spring Boot API", type: "Core Backend", ...DOWN },
      { id: "postgres-db", name: "PostgreSQL Database", type: "Database", ...DOWN },
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
    return {
      id: service.id,
      name: service.name,
      type: service.type,
      status: res.ok ? "operational" : "downtime",
      uptime: res.ok ? "100%" : "0%",
      latency: `${Math.round(performance.now() - start)}ms`,
    };
  } catch {
    return { id: service.id, name: service.name, type: service.type, ...DOWN };
  }
}

export async function getAllServiceHealth(): Promise<ServiceHealth[]> {
  const [internal, external] = await Promise.all([
    checkSpringBootBackend(),
    Promise.all(MONITORING_CONFIG.externalServices.map((s) => checkExternalUrl(s))),
  ]);
  return [...internal, ...external];
}
