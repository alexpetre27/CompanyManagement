import { NextResponse } from "next/server";
import { checkSpringBootBackend, checkExternalUrl } from "@/lib/health-check";
import { MONITORING_CONFIG } from "@/config/monitoring";

export const dynamic = "force-dynamic";

export async function GET() {
  const internalChecks = await checkSpringBootBackend();

  const externalChecks = await Promise.all(
    MONITORING_CONFIG.externalServices.map((s) => checkExternalUrl(s)),
  );

  const allServices = [...internalChecks, ...externalChecks];

  return NextResponse.json(allServices);
}
