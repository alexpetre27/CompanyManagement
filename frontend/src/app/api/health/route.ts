import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllServiceHealth } from "@/lib/health-check";

export const dynamic = "force-dynamic";

/** Liveness for container orchestration: unauthenticated callers only learn whether the frontend is up. */
export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ status: "UP" });
  }
  return NextResponse.json(await getAllServiceHealth());
}
