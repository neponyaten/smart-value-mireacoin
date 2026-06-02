import { isAdminRequest } from "@/lib/auth/admin-guard";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const params = await context.params;
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid application id" }, { status: 400 });
    }

    const application = await prisma.betaApplication.findUnique({
      where: { id },
      include: {
        decidedByUser: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Get beta application details error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
