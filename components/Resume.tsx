import Link from "next/link";
import { Award, BookOpen, Bot, BriefcaseBusiness, Code2, FileBadge, Folder, GraduationCap, HeartHandshake, Info, Languages, Sparkles, Stethoscope, User, Users, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "./Section";
import { Sidebar } from "./Sidebar";
import { PrintButton } from "./PrintButton";
import { QRCode } from "./QRCode";
import { defaultSectionConfig, type
  FontSize,
  ResumeData,
  ResumeDensity,
  ResumeTemplate,
  ResumeIconName,
  ResumeSectionConfig,
  TypeScale,
} from "../data/resume";
import { localizeFixedValue, t, type AppLanguage } from "../data/i18n";

type ResumeProps = {
  data: ResumeData;
  label?: string;
  printMode?: "balanced" | "compact" | "dense";
  template?: ResumeTemplate;
  typeScale?: TypeScale;
  density?: ResumeDensity;
  fontSize?: FontSize;
  fontScale?: number;
  language?: AppLanguage;
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

const iconMap: Record<ResumeIconName, LucideIcon> = {
  user: User, briefcase: BriefcaseBusiness, graduation: GraduationCap, folder: Folder,
  sparkles: Sparkles, wrench: Wrench, languages: Languages, award: Award, book: BookOpen,
  users: Users, heart: HeartHandshake, info: Info, stethoscope: Stethoscope, certificate: FileBadge,
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
  language = "es",
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
      <nav className="toolbar" aria-label="ResumeCraft">
        {showDemoLinks
          ? variantLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))
          : null}
        {actions}
        <PrintButton language={language} />
        <p className="print-tip">{t(language, "print.tip")}</p>
      </nav>

      {template === "modern-sidebar" ? (
        <ModernSidebarResume
          className={resumeClass}
          data={data}
          icons={icons}
          label={label}
          language={language}
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
          language={language}
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
          language={language}
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
          language={language}
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
          language={language}
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
  language: AppLanguage;
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
  language,
  showPhoto,
  showQr,
  summaryIcon: SummaryIcon,
  style,
}: TemplateProps) {
  return (
    <article className={className} style={style}>
      <Sidebar data={data} language={language} showPhoto={showPhoto} showQr={showQr} />
      <div className="main">
        <ModularSections data={data} language={language} fallbackSummaryIcon={SummaryIcon} legacyIcons={icons} />
      </div>
    </article>
  );
}

function ProfessionalCorporateResume({
  className,
  data,
  icons,
  label,
  language,
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
          <HeaderPhoto data={data} language={language} showPhoto={showPhoto} />
          <div>
            <h1>{data.name}</h1>
            <p>{data.headline}</p>
          </div>
        </div>
        <ContactBar data={data} />
      </header>
      <div className="corporate-main">
        <div>
          <ModularSections data={data} language={language} fallbackSummaryIcon={SummaryIcon} legacyIcons={icons} />
          <PortfolioQr data={data} language={language} show={showQr} />
        </div>
      </div>
    </article>
  );
}

function MinimalCleanResume({
  className,
  data,
  icons,
  label,
  language,
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
          <HeaderPhoto data={data} language={language} showPhoto={showPhoto} />
          <div>
            <h1>{data.name}</h1>
            <p>{data.headline}</p>
          </div>
        </div>
        <ContactBar data={data} />
      </header>
      <div className="minimal-main">
        <ModularSections data={data} language={language} fallbackSummaryIcon={SummaryIcon} legacyIcons={icons} />
        <PortfolioQr data={data} language={language} show={showQr} />
      </div>
    </article>
  );
}

function CreativeTechResume({
  className,
  data,
  icons,
  label,
  language,
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
        <HeaderPhoto data={data} language={language} showPhoto={showPhoto} />
      </header>
      <div className="creative-strip">
        <ContactBar data={data} />
      </div>
      <div className="creative-main">
        <section className="creative-highlight">
          <h2>{t(language, "section.coreStrengths")}</h2>
          <div className="focus-list" aria-label={t(language, "section.focus")}>
            {data.focus.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
        <ModularSections data={data} language={language} fallbackSummaryIcon={SummaryIcon} legacyIcons={icons} />
        <PortfolioQr data={data} language={language} show={showQr} />
      </div>
    </article>
  );
}

function ATSCleanResume({
  className,
  data,
  icons,
  label,
  language,
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
          <HeaderPhoto data={data} language={language} showPhoto={showPhoto} />
          <div>
            <h1>{data.name}</h1>
            <p>{data.headline}</p>
          </div>
        </div>
        <ContactBar data={data} />
      </header>
      <div className="ats-main">
        <ModularSections data={data} language={language} fallbackSummaryIcon={SummaryIcon} legacyIcons={icons} />
        <PortfolioQr data={data} language={language} show={showQr} />
      </div>
    </article>
  );
}

function HeaderPhoto({
  data,
  language,
  showPhoto = true,
}: {
  data: ResumeData;
  language: AppLanguage;
  showPhoto?: boolean;
}) {
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
      {photo ? (
        <img
          src={photo}
          alt={
            language === "en"
              ? `Professional photo of ${data.name}`
              : `Foto profesional de ${data.name}`
          }
        />
      ) : (
        initials
      )}
    </div>
  );
}

function ResumeIntro({
  data,
  label,
  language,
  SummaryIcon,
}: {
  data: ResumeData;
  label: string;
  language: AppLanguage;
  SummaryIcon: LucideIcon;
}) {
  return (
    <header className="topline">
      <p className="kicker">{label}</p>
      <div className="section-title">
        <span className="icon-badge" aria-hidden="true">
          <SummaryIcon size={15} strokeWidth={2.3} />
        </span>
        <h2>{t(language, "section.profile")}</h2>
      </div>
      <p className="summary">{data.summary}</p>
      <div className="focus-list" aria-label={t(language, "section.focus")}>
        {data.focus.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      {data.sections.additional ? (
        <p className="availability">
          <strong>{t(language, "section.availability")}</strong>
          {data.sections.additional}
        </p>
      ) : null}
    </header>
  );
}

function ModularSections({ data, language, fallbackSummaryIcon, legacyIcons }: { data: ResumeData; language: AppLanguage; fallbackSummaryIcon: LucideIcon; legacyIcons: TemplateProps["icons"] }) {
  const configs = data.sectionConfig?.length ? data.sectionConfig : defaultSectionConfig;
  return <>{configs.filter((section) => section.enabled && sectionHasContent(data, section)).map((section) => {
    const legacyIcon = section.kind === "experience" ? legacyIcons.experience : section.kind === "education" ? legacyIcons.education : section.kind === "projects" ? legacyIcons.projects : section.kind === "summary" ? legacyIcons.summary : undefined;
    const Icon = data.sectionConfig?.length ? (iconMap[section.icon] ?? fallbackSummaryIcon) : (legacyIcon ?? iconMap[section.icon] ?? fallbackSummaryIcon);
    if (section.kind === "summary") return (
      <header className="topline" key={section.id}>
        <div className="section-title"><span className="icon-badge" aria-hidden="true"><Icon size={15} /></span><h2>{section.title}</h2></div>
        <p className="summary">{data.summary}</p>
        {data.focus.length ? <div className="focus-list">{data.focus.map((item) => <span key={item}>{item}</span>)}</div> : null}
        {data.sections.additional ? <p className="availability"><strong>{t(language, "section.availability")}</strong>{data.sections.additional}</p> : null}
      </header>
    );
    if (section.kind === "experience") return <TimelineSection key={section.id} section={section} entries={data.sections.experience.map((x) => ({ title: x.title, subtitle: x.organization, period: x.period, description: x.description }))} language={language} />;
    if (section.kind === "education") return <TimelineSection key={section.id} section={section} entries={data.sections.education.map((x) => ({ title: x.degree, subtitle: x.institution, period: x.period, description: x.detail }))} language={language} />;
    if (section.kind === "projects") return <Section key={section.id} title={section.title} icon={Icon}><div className="project-grid">{data.sections.projects.map((x, i) => <article className="project" key={`${x.name}-${i}`}><h3>{x.name}</h3><p>{x.description}</p></article>)}</div></Section>;
    if (section.kind === "skills" || section.kind === "tools") return <Section key={section.id} title={section.title} icon={Icon}><ul className="simple-list">{data.sections[section.kind].map((x, i) => <li key={`${x}-${i}`}>{x}</li>)}</ul></Section>;
    if (section.kind === "languages") return <Section key={section.id} title={section.title} icon={Icon}><ul className="language-list">{data.sections.languages.map((x, i) => <li key={`${x.name}-${i}`}><strong>{x.name}</strong> {localizeFixedValue(language, x.level)}</li>)}</ul></Section>;
    const extra = data.extraSections?.find((item) => item.id === section.id);
    if (!extra) return null;
    if (section.kind === "text") return <Section key={section.id} title={section.title} icon={Icon}><p>{extra.text}</p></Section>;
    if (section.kind === "list") return <Section key={section.id} title={section.title} icon={Icon}><ul className="simple-list">{extra.items.map((x, i) => <li key={`${x.title}-${i}`}>{x.title}</li>)}</ul></Section>;
    return <TimelineSection key={section.id} section={section} entries={extra.items} language={language} />;
  })}</>;
}

function PortfolioQr({ data, language, show }: { data: ResumeData; language: AppLanguage; show?: boolean }) {
  if (!show || !data.contact.portfolio) return null;
  return <div className="list-block qr-list-block"><h2>{t(language, "section.portfolio")}</h2><QRCode value={data.contact.portfolio} language={language} /></div>;
}

function TimelineSection({ section, entries, language }: { section: ResumeSectionConfig; entries: Array<{ title: string; subtitle: string; period: string; description: string }>; language: AppLanguage }) {
  const Icon = iconMap[section.icon];
  return <Section title={section.title} icon={Icon}><div className="timeline">{entries.map((entry, index) => <div className="entry" key={`${entry.title}-${index}`}><h3>{entry.title}</h3>{entry.period ? <time>{localizeFixedValue(language, entry.period)}</time> : null}{entry.subtitle ? <span className="org">{entry.subtitle}</span> : null}{entry.description ? <p>{entry.description}</p> : null}</div>)}</div></Section>;
}

function sectionHasContent(data: ResumeData, section: ResumeSectionConfig) {
  if (section.kind === "summary") return Boolean(data.summary.trim() || data.focus.some(Boolean));
  if (["experience", "education", "projects", "skills", "tools", "languages"].includes(section.kind)) return (data.sections[section.kind as keyof ResumeData["sections"]] as unknown[] | undefined)?.length;
  const extra = data.extraSections?.find((item) => item.id === section.id);
  return Boolean(extra && (extra.text?.trim() || extra.items.some((item) => Object.values(item).some((value) => value.trim()))));
}

function CoreSections({
  data,
  icons,
  language,
}: {
  data: ResumeData;
  icons: TemplateProps["icons"];
  language: AppLanguage;
}) {
  return (
    <>
      <Section title={t(language, "section.experienceLong")} icon={icons.experience}>
        <div className="timeline">
          {data.sections.experience.map((entry) => (
            <div className="entry" key={`${entry.organization}-${entry.period}-${entry.title}`}>
              <h3>{entry.title}</h3>
              <time>{localizeFixedValue(language, entry.period)}</time>
              <span className="org">{entry.organization}</span>
              <p>{entry.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t(language, "section.projectsLong")} icon={icons.projects}>
        <div className="project-grid">
          {data.sections.projects.map((project) => (
            <article className="project" key={project.name}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title={t(language, "section.education")} icon={icons.education}>
        <div className="timeline">
          {data.sections.education.map((entry) => (
            <div className="entry" key={`${entry.degree}-${entry.period}`}>
              <h3>{entry.degree}</h3>
              <time>{localizeFixedValue(language, entry.period)}</time>
              <span className="org">{entry.institution}</span>
              <p>{entry.detail}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function ResumeSidebarLists({
  data,
  language,
  showQr = false,
}: {
  data: ResumeData;
  language: AppLanguage;
  showQr?: boolean;
}) {
  return (
    <aside className="resume-lists">
      <ListBlock title={t(language, "section.skills")} items={data.sections.skills} />
      <ListBlock title={t(language, "section.tools")} items={data.sections.tools} compact />
      <div className="list-block">
        <h2>{t(language, "section.languages")}</h2>
        <ul>
          {data.sections.languages.map((item) => (
            <li key={item.name}>
              <strong>{item.name}</strong> {localizeFixedValue(language, item.level)}
            </li>
          ))}
        </ul>
      </div>
      {showQr && data.contact.portfolio ? (
        <div className="list-block qr-list-block">
          <h2>{t(language, "section.portfolio")}</h2>
          <QRCode value={data.contact.portfolio} language={language} />
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
  const legacyItems = [
    data.contact.email,
    data.contact.phone,
    data.contact.location,
    data.contact.portfolio.replace(/^https?:\/\//, ""),
    data.contact.linkedIn.replace(/^https?:\/\/(www\.)?/, ""),
    data.contact.github.replace(/^https?:\/\/(www\.)?/, ""),
  ].filter(Boolean);
  const contactItems = [...legacyItems, ...(data.contact.items ?? []).filter((item) => item.enabled && item.value.trim()).map((item) => item.value)];

  return (
    <ul className="contact-bar">
      {contactItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
