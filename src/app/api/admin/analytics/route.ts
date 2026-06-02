import { isAdminRequest } from "@/lib/auth/admin-guard";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const [
      totalUsers,
      pendingApplications,
      approvedApplications,
      reportsTotal,
      achievementsTotal,
      vfxTotal,
      notificationsTotal,
      activeUsers,
      recentApplications,
      recentReports,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.betaApplication.count({ where: { status: "pending" } }),
      prisma.betaApplication.count({ where: { status: { in: ["approved", "invited", "completed"] } } }),
      prisma.contentReport.count(),
      prisma.achievement.count(),
      prisma.vfxCatalogItem.count(),
      prisma.notification.count(),
      prisma.user.count({
        where: {
          lastSeenAt: {
            gte: new Date(Date.now() - 1000 * 60 * 60 * 24),
          },
        },
      }),
      prisma.betaApplication.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, fullName: true, status: true, createdAt: true },
      }),
      prisma.contentReport.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, targetType: true, reason: true, status: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        pendingApplications,
        approvedApplications,
        reportsTotal,
        achievementsTotal,
        vfxTotal,
        notificationsTotal,
        activeUsers,
      },
      recentApplications,
      recentReports,
    });
  } catch (error) {
    console.error("Admin analytics GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
