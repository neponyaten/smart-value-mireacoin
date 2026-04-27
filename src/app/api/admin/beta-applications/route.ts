import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth/admin-guard";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { academicGroup: { contains: search } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.betaApplication.findMany({
        where,
        include: {
          decidedByUser: {
            select: { id: true, fullName: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.betaApplication.count({ where }),
    ]);

    return NextResponse.json({
      applications,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Get beta applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
