import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type NeonButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function NeonButton({ className, children, ...props }: NeonButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border border-cyan-300/40 bg-[linear-gradient(135deg,rgba(126,245,255,0.26),rgba(82,210,255,0.18))] px-4 py-2.5 text-sm font-semibold text-cyan-100 shadow-[0_10px_24px_rgba(0,175,255,0.2),0_0_24px_rgba(34,211,238,0.22)] transition duration-200 hover:scale-[1.03] hover:border-cyan-200/75 hover:brightness-105 hover:shadow-[0_14px_30px_rgba(0,175,255,0.3),0_0_30px_rgba(34,211,238,0.28)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
