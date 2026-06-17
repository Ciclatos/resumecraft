import Link from "next/link";
import { Bot, BriefcaseBusiness, Code2, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "./Section";
import { Sidebar } from "./Sidebar";
import { PrintButton } from "./PrintButton";
import { QRCode } from "./QRCode";
import type {
  FontSize,
  ResumeData,
  ResumeDensity,
  ResumeTemplate,
  TypeScale,
} from "../data/resume";

type ResumeProps = {
  data: ResumeData;
  label?: string;
  printMode?: "balanced" | "compact" | "dense";
  template?: ResumeTemplate;
  typeScale?: TypeScale;
  density?: ResumeDensity;
  fontSize?: FontSize;
  fontScale?: number;
  lineHeightScale?: number;
  spacingScale?: number;
  showDemoLinks?: boolean;
  showPhoto?: boolean;
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
  fontSize = "normal",
  fontScale = 100,
  lineHeightScale = 100,
  spacingScale = 100,
  showDemoLinks = true,
  showPhoto = true,
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
    `resume-font-${fontSize}`,
    `print-${printMode}`,
  ].join(" ");
  const resumeStyle = {
    "--font-slider-delta": `${(fontScale - 100) * 0.08}px`,
    "--line-height-slider": lineHeightScale / 100,
    "--spacing-slider": spacingScale / 100,
  } as React.CSSProperties;

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
          showPhoto={showPhoto}
          showQr={showQr}
          summaryIcon={SummaryIcon}
          style={resumeStyle}
        />
      ) : template === "professional-corporate" ? (
        <ProfessionalCorporateResume
          className={resumeClass}
          data={data}
          icons={icons}
          label={label}
          showPhoto={showPhoto}
          showQr={showQr}
          summaryIcon={SummaryIcon}
          style={resumeStyle}
        />
      ) : template === "minimal-clean" ? (
        <MinimalCleanResume
          className={resumeClass}
          data={data}
          icons={icons}
          label={label}
          showPhoto={showPhoto}
          showQr={showQr}
          summaryIcon={SummaryIcon}
          style={resumeStyle}
        />
      ) : template === "creative-tech" ? (
        <CreativeTechResume
          className={resumeClass}
          data={data}
          icons={icons}
          label={label}
          showPhoto={showPhoto}
          showQr={showQr}
          summaryIcon={SummaryIcon}
          style={resumeStyle}
        />
      ) : (
        <ATSCleanResume
          className={resumeClass}
          data={data}
          icons={icons}
          label={label}
          showPhoto={showPhoto}
          showQr={showQr}
          summaryIcon={SummaryIcon}
          style={resumeStyle}
        />
      )}
    </main>
  );
}

type TemplateProps = {
  className: string;
  data: ResumeData;
  label: string;
  showPhoto?: boolean;
  showQr?: boolean;
  summaryIcon: LucideIcon;
  style?: React.CSSProperties;
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
  showPhoto,
  showQr,
  summaryIcon: SummaryIcon,
  style,
}: TemplateProps) {
  return (
    <article className={className} style={style}>
      <Sidebar data={data} showPhoto={showPhoto} showQr={showQr} />
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
  showPhoto,
  showQr,
  summaryIcon: SummaryIcon,
  style,
}: TemplateProps) {
  return (
    <article className={className} style={style}>
      <header className="corporate-header">
        <p className="kicker">{label}</p>
        <div className="template-header-identity">
          <HeaderPhoto data={data} showPhoto={showPhoto} />
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
        <ResumeSidebarLists data={data} showQr={showQr} />
      </div>
    </article>
  );
}

function MinimalCleanResume({
  className,
  data,
  icons,
  label,
  showPhoto,
  showQr,
  summaryIcon: SummaryIcon,
  style,
}: TemplateProps) {
  return (
    <article className={className} style={style}>
      <header className="minimal-header">
        <p className="kicker">{label}</p>
        <div className="template-header-identity">
          <HeaderPhoto data={data} showPhoto={showPhoto} />
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
        <ResumeSidebarLists data={data} showQr={showQr} />
      </div>
    </article>
  );
}

function CreativeTechResume({
  className,
  data,
  icons,
  label,
  showPhoto,
  showQr,
  summaryIcon: SummaryIcon,
  style,
}: TemplateProps) {
  return (
    <article className={className} style={style}>
      <header className="creative-header">
        <div>
          <p className="kicker">{label}</p>
          <h1>{data.name}</h1>
          <p>{data.headline}</p>
        </div>
        <HeaderPhoto data={data} showPhoto={showPhoto} />
      </header>
      <div className="creative-strip">
        <ContactBar data={data} />
      </div>
      <div className="creative-main">
        <ResumeIntro data={data} label="Profile" SummaryIcon={SummaryIcon} />
        <section className="creative-highlight">
          <h2>Core strengths</h2>
          <div className="focus-list" aria-label="Enfoques principales">
            {data.focus.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
        <CoreSections data={data} icons={icons} />
        <ResumeSidebarLists data={data} showQr={showQr} />
      </div>
    </article>
  );
}

function ATSCleanResume({
  className,
  data,
  icons,
  label,
  showPhoto,
  showQr,
  summaryIcon: SummaryIcon,
  style,
}: TemplateProps) {
  return (
    <article className={className} style={style}>
      <header className="ats-header">
        <p className="kicker">{label}</p>
        <div className="template-header-identity">
          <HeaderPhoto data={data} showPhoto={showPhoto} />
          <div>
            <h1>{data.name}</h1>
            <p>{data.headline}</p>
          </div>
        </div>
        <ContactBar data={data} />
      </header>
      <div className="ats-main">
        <ResumeIntro data={data} label="Professional summary" SummaryIcon={SummaryIcon} />
        <CoreSections data={data} icons={icons} />
        <ResumeSidebarLists data={data} showQr={showQr} />
      </div>
    </article>
  );
}

function HeaderPhoto({ data, showPhoto = true }: { data: ResumeData; showPhoto?: boolean }) {
  const photo = data.photo?.trim();

  if (!showPhoto) {
    return null;
  }

  const initials =
    data.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("") || "RC";

  return (
    <div className={photo ? "template-header-photo" : "template-header-photo template-header-photo-fallback"}>
      {photo ? <img src={photo} alt={`Foto profesional de ${data.name}`} /> : initials}
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

function ResumeSidebarLists({ data, showQr = false }: { data: ResumeData; showQr?: boolean }) {
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
      {showQr && data.contact.portfolio ? (
        <div className="list-block qr-list-block">
          <h2>Portafolio</h2>
          <QRCode value={data.contact.portfolio} />
        </div>
      ) : null}
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
