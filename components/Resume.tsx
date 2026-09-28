import Link from "next/link";
import React from "react";
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
  SidebarWidth,
  TypeScale,
} from "../data/resume";
import { localizeFixedValue, t, type AppLanguage } from "../data/i18n";
import { contactEnabled, extraSectionTitle, mainSectionIds, listSectionIds, resolveSectionPreferences, sectionEnabled, sectionTitle } from "../lib/resumeCustomization";
import { resumeIcon } from "../lib/resumeIcons";

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
  sidebarWidth?: SidebarWidth;
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
  sidebarWidth = "normal",
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
    `resume-sidebar-${sidebarWidth}`,
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
        <ResumeIntro data={data} language={language} SummaryIcon={SummaryIcon} />
        <CoreSections data={data} icons={icons} language={language} />
      </div>
    </article>
  );
}

function ProfessionalCorporateResume({
  className,
  data,
  icons,
  language,
  showPhoto,
  showQr,
  summaryIcon: SummaryIcon,
  style,
}: TemplateProps) {
  return (
    <article className={className} style={style}>
      <header className="corporate-header">
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
          <ResumeIntro
            data={data}
            language={language}
            SummaryIcon={SummaryIcon}
          />
          <CoreSections data={data} icons={icons} language={language} />
        </div>
        <ResumeSidebarLists data={data} language={language} showQr={showQr} />
      </div>
    </article>
  );
}

function MinimalCleanResume({
  className,
  data,
  icons,
  language,
  showPhoto,
  showQr,
  summaryIcon: SummaryIcon,
  style,
}: TemplateProps) {
  return (
    <article className={className} style={style}>
      <header className="minimal-header">
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
        <ResumeIntro
          data={data}
          language={language}
          SummaryIcon={SummaryIcon}
        />
        <CoreSections data={data} icons={icons} language={language} />
        <ResumeSidebarLists data={data} language={language} showQr={showQr} />
      </div>
    </article>
  );
}

function CreativeTechResume({
  className,
  data,
  icons,
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
          <h1>{data.name}</h1>
          <p>{data.headline}</p>
        </div>
        <HeaderPhoto data={data} language={language} showPhoto={showPhoto} />
      </header>
      <div className="creative-strip">
        <ContactBar data={data} />
      </div>
      <div className="creative-main">
        <ResumeIntro
          data={data}
          language={language}
          SummaryIcon={SummaryIcon}
        />
        <section className="creative-highlight">
          <h2>{t(language, "section.coreStrengths")}</h2>
          <div className="focus-list" aria-label={t(language, "section.focus")}>
            {data.focus.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
        <CoreSections data={data} icons={icons} language={language} />
        <ResumeSidebarLists data={data} language={language} showQr={showQr} />
      </div>
    </article>
  );
}

function ATSCleanResume({
  className,
  data,
  icons,
  language,
  showPhoto,
  showQr,
  summaryIcon: SummaryIcon,
  style,
}: TemplateProps) {
  return (
    <article className={className} style={style}>
      <header className="ats-header">
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
        <ResumeIntro
          data={data}
          language={language}
          SummaryIcon={SummaryIcon}
        />
        <CoreSections data={data} icons={icons} language={language} />
        <ResumeSidebarLists data={data} language={language} showQr={showQr} />
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
  language,
  SummaryIcon,
}: {
  data: ResumeData;
  language: AppLanguage;
  SummaryIcon: LucideIcon;
}) {
  if (!sectionEnabled(data, "summary") || (!data.summary.trim() && !data.focus.some((item) => item.trim()))) return null;
  const configuredIcon = data.sectionPreferences?.find((item) => item.id === "summary")?.icon;
  const DisplayIcon = resumeIcon(configuredIcon, SummaryIcon);
  return (
    <header className="topline">
      <div className="section-title">
        <span className="icon-badge" aria-hidden="true">
          <DisplayIcon size={15} strokeWidth={2.3} />
        </span>
        <h2>{sectionTitle(data, "summary", language)}</h2>
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

function CoreSections({
  data,
  icons,
  language,
}: {
  data: ResumeData;
  icons: TemplateProps["icons"];
  language: AppLanguage;
}) {
  const preferences = resolveSectionPreferences(data).filter((item) => mainSectionIds.includes(item.id));
  return <>{preferences.map((preference) => {
    if (!preference.enabled) return null;
    if (preference.id === "experience") return data.sections.experience.length ? (
      <Section key="experience" title={sectionTitle(data, "experience", language)} icon={resumeIcon(preference.icon, icons.experience)}>
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
    ) : null;
    if (preference.id === "projects") return data.sections.projects.length ? (
      <Section key="projects" title={sectionTitle(data, "projects", language)} icon={resumeIcon(preference.icon, icons.projects)}>
        <div className="project-grid">
          {data.sections.projects.map((project) => (
            <article className="project" key={project.name}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
      </Section>
    ) : null;
    if (preference.id === "education") return data.sections.education.length ? (
      <Section key="education" title={sectionTitle(data, "education", language)} icon={resumeIcon(preference.icon, icons.education)}>
        <div className="timeline">
          {data.sections.education.map((entry) => (
            <div className="entry" key={`${entry.degree}-${entry.period}`}>
              <h3>{entry.degree}</h3>
              <time>{localizeFixedValue(language, entry.period)}</time>
              <span className="org">{entry.institution}</span>
              {entry.detail.trim() ? <p>{entry.detail}</p> : null}
            </div>
          ))}
        </div>
      </Section>
    ) : null;
    return null;
  })}<ExtraSections data={data} language={language} /></>;
}

function ExtraSections({ data, language }: { data: ResumeData; language: AppLanguage }) {
  return <>{(data.extraSections ?? []).filter((item) => item.enabled && (item.text?.trim() || item.entries.length)).map((extra) => {
    const Icon = resumeIcon(extra.icon);
    if (extra.kind === "text") return <Section key={extra.id} title={extraSectionTitle(extra, language)} icon={Icon}><p>{extra.text}</p></Section>;
    if (extra.kind === "list") return <Section key={extra.id} title={extraSectionTitle(extra, language)} icon={Icon}><ul className="simple-list">{extra.entries.map((entry, index) => <li key={`${entry.title}-${index}`}>{entry.title}</li>)}</ul></Section>;
    return <Section key={extra.id} title={extraSectionTitle(extra, language)} icon={Icon}><div className="timeline">{extra.entries.map((entry, index) => <div className="entry" key={`${entry.title}-${index}`}><h3>{entry.title}</h3>{entry.period ? <time>{localizeFixedValue(language, entry.period)}</time> : null}{entry.subtitle ? <span className="org">{entry.subtitle}</span> : null}{entry.description ? <p>{entry.description}</p> : null}{entry.contact ? <p>{entry.contact}</p> : null}</div>)}</div></Section>;
  })}</>;
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
  const preferences = resolveSectionPreferences(data).filter((item) => listSectionIds.includes(item.id));
  return (
    <aside className="resume-lists">
      {preferences.map((preference) => {
        if (!preference.enabled) return null;
        if (preference.id === "skills") return data.sections.skills.length ? <ListBlock key="skills" title={sectionTitle(data, "skills", language)} items={data.sections.skills} /> : null;
        if (preference.id === "tools") return data.sections.tools.length ? <ListBlock key="tools" title={sectionTitle(data, "tools", language)} items={data.sections.tools} compact /> : null;
        if (preference.id !== "languages" || !data.sections.languages.length) return null;
        return <div className="list-block" key="languages">
        <h2>{sectionTitle(data, "languages", language)}</h2>
        <ul>
          {data.sections.languages.map((item) => (
            <li key={item.name}>
              <strong>{item.name}</strong> {localizeFixedValue(language, item.level)}
            </li>
          ))}
        </ul>
      </div>})}
      {showQr && contactEnabled(data, "portfolio") && data.contact.portfolio ? (
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
  const contactItems = [
    contactEnabled(data, "email") ? data.contact.email : "",
    contactEnabled(data, "phone") ? data.contact.phone : "",
    contactEnabled(data, "location") ? data.contact.location : "",
    contactEnabled(data, "portfolio") ? data.contact.portfolio.replace(/^https?:\/\//, "") : "",
    contactEnabled(data, "linkedIn") ? data.contact.linkedIn.replace(/^https?:\/\/(www\.)?/, "") : "",
    contactEnabled(data, "github") ? data.contact.github.replace(/^https?:\/\/(www\.)?/, "") : "",
    ...(data.contact.custom ?? []).filter((item) => item.enabled && item.value.trim()).map((item) => item.value),
  ].filter(Boolean);

  return (
    <ul className="contact-bar">
      {contactItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
