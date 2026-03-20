import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type NeonButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function NeonButton({ className, children, ...props }: NeonButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-300/15 px-4 py-2.5 text-sm font-semibold text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.24)] transition hover:border-cyan-200/70 hover:bg-cyan-200/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
