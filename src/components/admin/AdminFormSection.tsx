import { ReactNode } from "react";

type AdminFormSectionProps = {
  title: string;
  children: ReactNode;
};

export function AdminFormSection({ title, children }: AdminFormSectionProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
      {children}
    </section>
  );
}
