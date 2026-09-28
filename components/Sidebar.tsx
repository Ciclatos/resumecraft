import {
  Github,
  Globe,
  Languages,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import type { ResumeData } from "../data/resume";
import { localizeFixedValue, t, type AppLanguage } from "../data/i18n";
import { contactEnabled, listSectionIds, resolveSectionPreferences, sectionTitle } from "../lib/resumeCustomization";
import { resumeIcon } from "../lib/resumeIcons";
import { QRCode } from "./QRCode";

type SidebarProps = {
  data: ResumeData;
  language?: AppLanguage;
  showPhoto?: boolean;
  showQr?: boolean;
};

export function Sidebar({ data, language = "es", showPhoto = true, showQr = false }: SidebarProps) {
  const photo = data.photo?.trim();
  const contact = data.contact;
  const portfolioLabel = contact.portfolio.replace(/^https?:\/\//, "");
  const linkedInLabel = contact.linkedIn.replace(/^https?:\/\/(www\.)?/, "");
  const githubLabel = contact.github.replace(/^https?:\/\/(www\.)?/, "");
  const listPreferences = resolveSectionPreferences(data).filter((item) => listSectionIds.includes(item.id));
  const customContacts = (contact.custom ?? []).filter((item) => item.enabled && item.value.trim());
  const hasContact = (contactEnabled(data, "email") && contact.email) || (contactEnabled(data, "phone") && contact.phone)
    || (contactEnabled(data, "location") && contact.location) || (contactEnabled(data, "portfolio") && contact.portfolio)
    || (contactEnabled(data, "linkedIn") && contact.linkedIn) || (contactEnabled(data, "github") && contact.github) || customContacts.length;
  const initials =
    data.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("") || "RC";

  return (
    <aside className="sidebar">
      {showPhoto && photo ? (
        <div className="portrait">
          <img
            src={photo}
            alt={
              language === "en"
                ? `Professional photo of ${data.name}`
                : `Foto profesional de ${data.name}`
            }
          />
        </div>
      ) : showPhoto ? (
        <div className="portrait portrait-fallback" aria-hidden="true">
          {initials}
        </div>
      ) : null}

      <div className="identity">
        <h1>{data.name}</h1>
        <p>{data.headline}</p>
      </div>

      {hasContact ? <SideSection title={t(language, "section.contact")} icon={User}>
        <ul className="contact-list">
          {contactEnabled(data, "email") && contact.email ? <li>
            <Mail size={14} aria-hidden="true" />
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </li> : null}
          {contactEnabled(data, "phone") && contact.phone ? <li>
            <Phone size={14} aria-hidden="true" />
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
          </li> : null}
          {contactEnabled(data, "location") && contact.location ? <li>
            <MapPin size={14} aria-hidden="true" />
            <span>{contact.location}</span>
          </li> : null}
          {contactEnabled(data, "portfolio") && contact.portfolio ? (
            <li>
              <Globe size={14} aria-hidden="true" />
              <a href={contact.portfolio}>{portfolioLabel}</a>
            </li>
          ) : null}
          {contactEnabled(data, "linkedIn") && contact.linkedIn ? (
            <li>
              <Linkedin size={14} aria-hidden="true" />
              <a href={contact.linkedIn}>{linkedInLabel}</a>
            </li>
          ) : null}
          {contactEnabled(data, "github") && contact.github ? (
            <li>
              <Github size={14} aria-hidden="true" />
              <a href={contact.github}>{githubLabel}</a>
            </li>
          ) : null}
          {customContacts.map((item) => {
            const Icon = resumeIcon(item.icon, User);
            return <li key={item.id}><Icon size={14} aria-hidden="true" />{item.url ? <a href={item.url}>{item.value}</a> : <span>{item.value}</span>}</li>;
          })}
        </ul>
      </SideSection> : null}

      {listPreferences.map((preference) => {
        if (!preference.enabled) return null;
        if (preference.id === "skills" && data.sections.skills.length) return <SideSection key="skills" title={sectionTitle(data, "skills", language)} icon={resumeIcon(preference.icon, Sparkles)}><ul className="simple-list">{data.sections.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></SideSection>;
        if (preference.id === "tools" && data.sections.tools.length) return <SideSection key="tools" title={sectionTitle(data, "tools", language)} icon={resumeIcon(preference.icon, Wrench)}><ul className="simple-list tool-list">{data.sections.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul></SideSection>;
        if (preference.id === "languages" && data.sections.languages.length) return <SideSection key="languages" title={sectionTitle(data, "languages", language)} icon={resumeIcon(preference.icon, Languages)}><ul className="language-list">{data.sections.languages.map((item) => <li key={item.name}><strong>{item.name}</strong>{localizeFixedValue(language, item.level)}</li>)}</ul></SideSection>;
        return null;
      })}

      {showQr && contactEnabled(data, "portfolio") && contact.portfolio ? (
        <SideSection title={t(language, "section.portfolio")} icon={Globe}>
          <QRCode value={contact.portfolio} language={language} />
        </SideSection>
      ) : null}
    </aside>
  );
}

type SideSectionProps = {
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  children: React.ReactNode;
};

function SideSection({ title, icon: Icon, children }: SideSectionProps) {
  return (
    <section className="side-section">
      <div className="side-title">
        <span className="icon-badge" aria-hidden="true">
          <Icon size={14} strokeWidth={2.4} />
        </span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}
