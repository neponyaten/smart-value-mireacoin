import { getAvatarGradient, getUserInitials } from "@/lib/utils/avatar";

type InitialsAvatarProps = {
  userId: string;
  name?: string;
  surname?: string;
  displayName?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClassMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-24 w-24 text-2xl",
} as const;

export function InitialsAvatar({ userId, name, surname, displayName, size = "md" }: InitialsAvatarProps) {
  const initials = getUserInitials(name, surname, displayName);
  const gradient = getAvatarGradient(`${userId}:${initials}`);

  return (
    <div
      className={`relative flex ${sizeClassMap[size]} items-center justify-center rounded-full border border-cyan-200/30 bg-gradient-to-br ${gradient} font-semibold text-cyan-100 shadow-[0_0_24px_-14px_rgba(34,211,238,0.85)]`}
      aria-label={displayName || initials}
    >
      <span>{initials}</span>
    </div>
  );
}
