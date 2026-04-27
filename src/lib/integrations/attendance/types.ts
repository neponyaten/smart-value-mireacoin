export type AttendanceProviderKind = "LKS" | "ATTENDANCE";

export type ProviderToken = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
};

export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";

export type SyncSummary = {
  profile: {
    studentId: string;
    email: string;
    fullName: string;
    group: string;
    role: "STUDENT" | "LEADER";
    roleName?: string;
    institute?: string;
    externalId: string;
  };
  attendancePercent?: number;
  statusLabel?: string;
  attendance: Array<{
    externalRecordId: string;
    lessonDate: Date;
    subject: string;
    teacher?: string;
    lessonType?: string;
    status: AttendanceStatus;
    points?: number;
    sourceUpdatedAt?: Date;
  }>;
};
