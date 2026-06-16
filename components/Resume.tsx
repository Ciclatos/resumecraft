import Link from "next/link";
import { Bot, BriefcaseBusiness, Code2, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "./Section";
import { Sidebar } from "./Sidebar";
import { PrintButton } from "./PrintButton";
import type { ResumeData } from "../data/resume";

type ResumeProps = {
  data: ResumeData;
  label?: string;
  printMode?: "balanced" | "compact" | "dense";
  showDemoLinks?: boolean;
  showQr?: boolean;
  actions?: React.ReactNode;
  icons?: {
    summary: LucideIcon;
    experience: LucideIcon;
    projects: LucideIcon;
    education: LucideIcon;
  };
};

const variantLinks = [
  { href: "/", label: "ResumeCraft" },
  { href: "/builder", label: "Crear CV" },
  { href: "/cv/base", label: "Demo base" },
  { href: "/cv/edteam", label: "Demo EDteam" },
  { href: "/cv/walmart", label: "Demo Walmart" },
];

const defaultIcons = {
  summary: Bot,
  experience: BriefcaseBusiness,
  projects: Code2,
  education: GraduationCap,
};

export function Resume({
  data,
  label = "ResumeCraft CV",
  printMode = "balanced",
  showDemoLinks = true,
  showQr = false,
  actions,
  icons = defaultIcons,
}: ResumeProps) {
  const SummaryIcon = icons.summary;
  const resumeClass = `resume print-${printMode}`;

  return (
    <main className="screen-shell">
      <nav className="toolbar" aria-label="Variantes del CV">
        {showDemoLinks
          ? variantLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))
          : null}
        {actions}
        <PrintButton />
        <p className="print-tip">
          PDF: A4, escala 90-95%, márgenes ninguno, gráficos de fondo activados.
        </p>
      </nav>

      <article className={resumeClass}>
        <Sidebar data={data} showQr={showQr} />
        <div className="main">
          <header className="topline">
            <p className="kicker">{label}</p>
            <div className="section-title">
              <span className="icon-badge" aria-hidden="true">
                <SummaryIcon size={15} strokeWidth={2.3} />
              </span>
              <h2>Perfil profesional</h2>
            </div>
            <p className="summary">{data.summary}</p>
            <div className="focus-list" aria-label="Enfoques principales">
              {data.focus.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            {data.sections.additional ? (
              <p className="availability">
                <strong>Disponibilidad y encaje operativo</strong>
                {data.sections.additional}
              </p>
            ) : null}
          </header>

          <Section title="Experiencia laboral" icon={icons.experience}>
            <div className="timeline">
              {data.sections.experience.map((entry) => (
                <div className="entry" key={`${entry.organization}-${entry.period}`}>
                  <h3>{entry.title}</h3>
                  <time>{entry.period}</time>
                  <span className="org">{entry.organization}</span>
                  <p>{entry.description}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Proyectos destacados" icon={icons.projects}>
            <div className="project-grid">
              {data.sections.projects.map((project) => (
                <article className="project" key={project.name}>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </article>
              ))}
            </div>
          </Section>

          <Section title="Formación" icon={icons.education}>
            <div className="timeline">
              {data.sections.education.map((entry) => (
                <div className="entry" key={`${entry.degree}-${entry.period}`}>
                  <h3>{entry.degree}</h3>
                  <time>{entry.period}</time>
                  <span className="org">{entry.institution}</span>
                  <p>{entry.detail}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </article>
    </main>
  );
}
