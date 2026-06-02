import { ReactNode } from "react";

type AdminFormProps = {
  children: ReactNode;
  onSubmit?: () => void;
};

export function AdminForm({ children, onSubmit }: AdminFormProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4" onSubmit={onSubmit}>
      {children}
    </div>
  );
}
