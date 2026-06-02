import { ReactNode } from "react";

type AdminTableToolbarProps = {
  children: ReactNode;
};

export function AdminTableToolbar({ children }: AdminTableToolbarProps) {
  return <div className="mt-4 flex flex-wrap items-center gap-2">{children}</div>;
}
