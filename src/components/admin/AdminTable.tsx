import { ReactNode } from "react";

type AdminTableProps = {
  children: ReactNode;
};

export function AdminTable({ children }: AdminTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/50">
      <table className="min-w-full text-left text-sm">{children}</table>
    </div>
  );
}
