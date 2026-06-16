import Link from "next/link";
import { Section } from "./Section";
import { Sidebar } from "./Sidebar";
import { PrintButton } from "./PrintButton";
import type { ResumeVariant } from "../data/variants";

type ResumeProps = {
  variant: ResumeVariant;
};

const variantLinks = [
  { href: "/cv/base", label: "Base" },
  { href: "/cv/edteam", label: "EDteam" },
  { href: "/cv/walmart", label: "Walmart" },
];

export function Resume({ variant }: ResumeProps) {
  const SummaryIcon = variant.icons.summary;
  const resumeClass = `resume resume-${variant.slug} print-${variant.printMode}`;

  return (
    <main className="screen-shell">
      <nav className="toolbar" aria-label="Variantes del CV">
        {variantLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <PrintButton />
        <p className="print-tip">
          PDF: A4, escala 90-95%, márgenes ninguno, gráficos de fondo activados.
        </p>
      </nav>

      <article className={resumeClass}>
        <Sidebar variant={variant} />
        <div className="main">
          <header className="topline">
            <p className="kicker">{variant.name}</p>
            <div className="section-title">
              <span className="icon-badge" aria-hidden="true">
                <SummaryIcon size={15} strokeWidth={2.3} />
              </span>
              <h2>Perfil profesional</h2>
            </div>
            <p className="summary">{variant.summary}</p>
            <div className="focus-list" aria-label="Enfoques principales">
              {variant.focus.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            {variant.sections.additional ? (
              <p className="availability">
                <strong>Disponibilidad y encaje operativo</strong>
                {variant.sections.additional}
              </p>
            ) : null}
          </header>

          <Section title="Experiencia laboral" icon={variant.icons.experience}>
            <div className="timeline">
              {variant.sections.experience.map((entry) => (
                <div className="entry" key={`${entry.organization}-${entry.period}`}>
                  <h3>{entry.title}</h3>
                  <time>{entry.period}</time>
                  <span className="org">{entry.organization}</span>
                  <p>{entry.description}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Proyectos destacados" icon={variant.icons.projects}>
            <div className="project-grid">
              {variant.sections.projects.map((project) => (
                <article className="project" key={project.name}>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </article>
              ))}
            </div>
          </Section>

          <Section title="Formación" icon={variant.icons.education}>
            <div className="timeline">
              {variant.sections.education.map((entry) => (
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
