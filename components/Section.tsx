import type { LucideIcon } from "lucide-react";

type SectionProps = {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
};

export function Section({ title, icon: Icon, children }: SectionProps) {
  return (
    <section className="section">
      <div className="section-title">
        <span className="icon-badge" aria-hidden="true">
          <Icon size={15} strokeWidth={2.3} />
        </span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
