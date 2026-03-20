import { cn } from "@/lib/utils/cn";
import type { PropsWithChildren } from "react";

type GlassCardProps = PropsWithChildren<{
  className?: string;
}>;

export function GlassCard({ className, children }: GlassCardProps) {
  return <div className={cn("glass-card", className)}>{children}</div>;
}
