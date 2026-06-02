import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new Response(JSON.stringify({ error: "Not allowed in production" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  try {
    const apps = await prisma.betaApplication.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    const total = await prisma.betaApplication.count();
    return new Response(JSON.stringify({ total, applications: apps }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Debug beta apps error:", err);
    return new Response(JSON.stringify({ error: "Internal" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
