import { prisma } from "@/lib/prisma";
import type { AttendanceProviderKind, ProviderToken, SyncSummary } from "@/lib/integrations/attendance/types";

type PersistedSyncResult = {
  userId: string;
  studentId: string;
  profile: {
    fullName: string;
    group: string;
    role: "STUDENT" | "LEADER";
    attendancePercent?: number;
    statusLabel?: string;
  };
  lastSyncedAt: string;
};

function mapProvider(provider: AttendanceProviderKind) {
  return provider === "ATTENDANCE" ? "ATTENDANCE" : "LKS";
}

function mapRole(role: "STUDENT" | "LEADER") {
  return role === "LEADER" ? "LEADER" : "STUDENT";
}

function mapAttendanceStatus(status: SyncSummary["attendance"][number]["status"]) {
  const normalized = status.toUpperCase();
  if (normalized === "LATE") {
    return "LATE";
  }
  if (normalized === "ABSENT") {
    return "ABSENT";
  }
  if (normalized === "EXCUSED") {
    return "EXCUSED";
  }
  return "PRESENT";
}

export async function persistExternalSync(params: {
  provider: AttendanceProviderKind;
  token: ProviderToken;
  summary: SyncSummary;
}): Promise<PersistedSyncResult> {
  const provider = mapProvider(params.provider);
  const { profile, attendance, attendancePercent, statusLabel } = params.summary;

  const user = await (prisma as any).user.upsert({
    where: { studentId: profile.studentId },
    update: {
      email: profile.email,
      fullName: profile.fullName,
      group: profile.group,
      role: mapRole(profile.role),
    },
    create: {
      studentId: profile.studentId,
      email: profile.email,
      fullName: profile.fullName,
      group: profile.group,
      role: mapRole(profile.role),
      balance: 0,
    },
  });

  await (prisma as any).externalAccount.upsert({
    where: { userId: user.id },
    update: {
      provider,
      externalId: profile.externalId,
      username: profile.email,
      accessToken: params.token.accessToken,
      refreshToken: params.token.refreshToken,
      tokenExpiresAt: params.token.expiresAt,
      lastSyncedAt: new Date(),
    },
    create: {
      userId: user.id,
      provider,
      externalId: profile.externalId,
      username: profile.email,
      accessToken: params.token.accessToken,
      refreshToken: params.token.refreshToken,
      tokenExpiresAt: params.token.expiresAt,
      lastSyncedAt: new Date(),
    },
  });

  await (prisma as any).studentProfile.upsert({
    where: { userId: user.id },
    update: {
      institute: profile.institute,
      fullName: profile.fullName,
      group: profile.group,
      roleName: profile.roleName,
      attendancePercent,
      status: statusLabel,
      syncedAt: new Date(),
    },
    create: {
      userId: user.id,
      institute: profile.institute,
      fullName: profile.fullName,
      group: profile.group,
      roleName: profile.roleName,
      attendancePercent,
      status: statusLabel,
      syncedAt: new Date(),
    },
  });

  for (const record of attendance) {
    await (prisma as any).attendanceRecord.upsert({
      where: {
        userId_externalRecordId: {
          userId: user.id,
          externalRecordId: record.externalRecordId,
        },
      },
      update: {
        lessonDate: record.lessonDate,
        subject: record.subject,
        teacher: record.teacher,
        lessonType: record.lessonType,
        status: mapAttendanceStatus(record.status),
        points: record.points ?? 0,
        sourceUpdatedAt: record.sourceUpdatedAt,
      },
      create: {
        userId: user.id,
        externalRecordId: record.externalRecordId,
        lessonDate: record.lessonDate,
        subject: record.subject,
        teacher: record.teacher,
        lessonType: record.lessonType,
        status: mapAttendanceStatus(record.status),
        points: record.points ?? 0,
        sourceUpdatedAt: record.sourceUpdatedAt,
      },
    });
  }

  return {
    userId: user.id,
    studentId: user.studentId,
    profile: {
      fullName: user.fullName,
      group: user.group,
      role: user.role,
      attendancePercent,
      statusLabel,
    },
    lastSyncedAt: new Date().toISOString(),
  };
}

export async function getSyncStatusByStudentId(studentId: string) {
  const user = await (prisma as any).user.findUnique({
    where: { studentId },
    include: {
      externalAccount: true,
      studentProfile: true,
      attendance: {
        orderBy: { lessonDate: "desc" },
        take: 30,
      },
    },
  });

  if (!user) {
    return null;
  }

  const records: Array<{
    lessonDate: Date;
    subject: string;
    teacher?: string | null;
    lessonType?: string | null;
    status: string;
  }> = user.attendance;
  const total = records.length;
  const presents = records.filter((item) => item.status === "PRESENT").length;
  const lates = records.filter((item) => item.status === "LATE").length;
  const absents = records.filter((item) => item.status === "ABSENT").length;

  return {
    connected: Boolean(user.externalAccount),
    provider: user.externalAccount?.provider ?? null,
    lastSyncedAt: user.externalAccount?.lastSyncedAt?.toISOString() ?? null,
    profile: {
      fullName: user.fullName,
      group: user.group,
      role: user.role,
      institute: user.studentProfile?.institute ?? null,
      roleName: user.studentProfile?.roleName ?? null,
      attendancePercent: user.studentProfile?.attendancePercent ?? null,
      status: user.studentProfile?.status ?? null,
    },
    attendanceSummary: {
      total,
      present: presents,
      late: lates,
      absent: absents,
    },
    recentRecords: records.slice(0, 10).map((item) => ({
      date: item.lessonDate.toISOString(),
      subject: item.subject,
      status: item.status,
      teacher: item.teacher ?? null,
      lessonType: item.lessonType ?? null,
    })),
  };
}
