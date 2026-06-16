import Link from "next/link";
import { Bot, BriefcaseBusiness, Code2, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "./Section";
import { Sidebar } from "./Sidebar";
import { PrintButton } from "./PrintButton";
import type { ResumeData, ResumeDensity, ResumeTemplate, TypeScale } from "../data/resume";

type ResumeProps = {
  data: ResumeData;
  label?: string;
  printMode?: "balanced" | "compact" | "dense";
  template?: ResumeTemplate;
  typeScale?: TypeScale;
  density?: ResumeDensity;
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
  { href: "/cv/edteam", label: "Demo tecnología" },
  { href: "/cv/walmart", label: "Demo corporativo" },
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
  template = "modern-sidebar",
  typeScale = "normal",
  density = "normal",
  showDemoLinks = true,
  showQr = false,
  actions,
  icons = defaultIcons,
}: ResumeProps) {
  const SummaryIcon = icons.summary;
  const resumeClass = [
    "resume",
    `resume-template-${template}`,
    `resume-scale-${typeScale}`,
    `resume-density-${density}`,
    `print-${printMode}`,
  ].join(" ");

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

      {template === "modern-sidebar" ? (
        <ModernSidebarResume
          className={resumeClass}
          data={data}
          icons={icons}
          label={label}
          showQr={showQr}
          summaryIcon={SummaryIcon}
        />
      ) : template === "professional-corporate" ? (
        <ProfessionalCorporateResume
          className={resumeClass}
          data={data}
          icons={icons}
          label={label}
          summaryIcon={SummaryIcon}
        />
      ) : (
        <MinimalCleanResume
          className={resumeClass}
          data={data}
          icons={icons}
          label={label}
          summaryIcon={SummaryIcon}
        />
      )}
    </main>
  );
}

type TemplateProps = {
  className: string;
  data: ResumeData;
  label: string;
  showQr?: boolean;
  summaryIcon: LucideIcon;
  icons: {
    summary: LucideIcon;
    experience: LucideIcon;
    projects: LucideIcon;
    education: LucideIcon;
  };
};

function ModernSidebarResume({
  className,
  data,
  icons,
  label,
  showQr,
  summaryIcon: SummaryIcon,
}: TemplateProps) {
  return (
    <article className={className}>
      <Sidebar data={data} showQr={showQr} />
      <div className="main">
        <ResumeIntro data={data} label={label} SummaryIcon={SummaryIcon} />
        <CoreSections data={data} icons={icons} />
      </div>
    </article>
  );
}

function ProfessionalCorporateResume({
  className,
  data,
  icons,
  label,
  summaryIcon: SummaryIcon,
}: TemplateProps) {
  return (
    <article className={className}>
      <header className="corporate-header">
        <p className="kicker">{label}</p>
        <div className="template-header-identity">
          <HeaderPhoto data={data} />
          <div>
            <h1>{data.name}</h1>
            <p>{data.headline}</p>
          </div>
        </div>
        <ContactBar data={data} />
      </header>
      <div className="corporate-main">
        <div>
          <ResumeIntro data={data} label="Professional profile" SummaryIcon={SummaryIcon} />
          <CoreSections data={data} icons={icons} />
        </div>
        <ResumeSidebarLists data={data} />
      </div>
    </article>
  );
}

function MinimalCleanResume({
  className,
  data,
  icons,
  label,
  summaryIcon: SummaryIcon,
}: TemplateProps) {
  return (
    <article className={className}>
      <header className="minimal-header">
        <p className="kicker">{label}</p>
        <div className="template-header-identity">
          <HeaderPhoto data={data} />
          <div>
            <h1>{data.name}</h1>
            <p>{data.headline}</p>
          </div>
        </div>
        <ContactBar data={data} />
      </header>
      <div className="minimal-main">
        <ResumeIntro data={data} label="Profile" SummaryIcon={SummaryIcon} />
        <CoreSections data={data} icons={icons} />
        <ResumeSidebarLists data={data} />
      </div>
    </article>
  );
}

function HeaderPhoto({ data }: { data: ResumeData }) {
  const photo = data.photo?.trim();

  if (!photo) {
    return null;
  }

  return (
    <div className="template-header-photo">
      <img src={photo} alt={`Foto profesional de ${data.name}`} />
    </div>
  );
}

function ResumeIntro({
  data,
  label,
  SummaryIcon,
}: {
  data: ResumeData;
  label: string;
  SummaryIcon: LucideIcon;
}) {
  return (
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
  );
}

function CoreSections({
  data,
  icons,
}: {
  data: ResumeData;
  icons: TemplateProps["icons"];
}) {
  return (
    <>
      <Section title="Experiencia laboral" icon={icons.experience}>
        <div className="timeline">
          {data.sections.experience.map((entry) => (
            <div className="entry" key={`${entry.organization}-${entry.period}-${entry.title}`}>
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
    </>
  );
}

function ResumeSidebarLists({ data }: { data: ResumeData }) {
  return (
    <aside className="resume-lists">
      <ListBlock title="Habilidades" items={data.sections.skills} />
      <ListBlock title="Herramientas" items={data.sections.tools} compact />
      <div className="list-block">
        <h2>Idiomas</h2>
        <ul>
          {data.sections.languages.map((language) => (
            <li key={language.name}>
              <strong>{language.name}</strong> {language.level}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function ListBlock({
  title,
  items,
  compact,
}: {
  title: string;
  items: string[];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "list-block list-block-compact" : "list-block"}>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ContactBar({ data }: { data: ResumeData }) {
  const contactItems = [
    data.contact.email,
    data.contact.phone,
    data.contact.location,
    data.contact.portfolio.replace(/^https?:\/\//, ""),
    data.contact.linkedIn.replace(/^https?:\/\/(www\.)?/, ""),
    data.contact.github.replace(/^https?:\/\/(www\.)?/, ""),
  ].filter(Boolean);

  return (
    <ul className="contact-bar">
      {contactItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
