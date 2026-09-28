import {
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  User,
  BadgeCheck,
  Award,
  BookOpen,
  BriefcaseBusiness,
  FileBadge,
  Folder,
  GraduationCap,
  HeartHandshake,
  Info,
  Languages,
  Sparkles,
  Stethoscope,
  Users,
  Wrench,
} from "lucide-react";
import type { ResumeData, ResumeIconName } from "../data/resume";
import { t, type AppLanguage } from "../data/i18n";
import { QRCode } from "./QRCode";

type SidebarProps = {
  data: ResumeData;
  language?: AppLanguage;
  showPhoto?: boolean;
  showQr?: boolean;
};

const contactIconMap = { user: User, briefcase: BriefcaseBusiness, graduation: GraduationCap, folder: Folder, sparkles: Sparkles, wrench: Wrench, languages: Languages, award: Award, book: BookOpen, users: Users, heart: HeartHandshake, info: Info, stethoscope: Stethoscope, certificate: FileBadge } satisfies Record<ResumeIconName, typeof User>;

export function Sidebar({ data, language = "es", showPhoto = true, showQr = false }: SidebarProps) {
  const photo = data.photo?.trim();
  const contact = data.contact;
  const portfolioLabel = contact.portfolio.replace(/^https?:\/\//, "");
  const linkedInLabel = contact.linkedIn.replace(/^https?:\/\/(www\.)?/, "");
  const githubLabel = contact.github.replace(/^https?:\/\/(www\.)?/, "");
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

      <SideSection title={t(language, "section.contact")} icon={User}>
        <ul className="contact-list">
          {contact.email ? <li>
            <Mail size={14} aria-hidden="true" />
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </li> : null}
          {contact.phone ? <li>
            <Phone size={14} aria-hidden="true" />
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
          </li> : null}
          {contact.location ? <li>
            <MapPin size={14} aria-hidden="true" />
            <span>{contact.location}</span>
          </li> : null}
          {contact.portfolio ? (
            <li>
              <Globe size={14} aria-hidden="true" />
              <a href={contact.portfolio}>{portfolioLabel}</a>
            </li>
          ) : null}
          {contact.linkedIn ? (
            <li>
              <Linkedin size={14} aria-hidden="true" />
              <a href={contact.linkedIn}>{linkedInLabel}</a>
            </li>
          ) : null}
          {contact.github ? (
            <li>
              <Github size={14} aria-hidden="true" />
              <a href={contact.github}>{githubLabel}</a>
            </li>
          ) : null}
          {contact.items?.filter((item) => item.enabled && item.value.trim()).map((item) => {
            const ContactIcon = contactIconMap[item.icon] ?? BadgeCheck;
            return <li key={item.id}>
              <ContactIcon size={14} aria-hidden="true" />
              {item.url ? <a href={item.url}>{item.value}</a> : <span>{item.value}</span>}
            </li>;
          })}
        </ul>
      </SideSection>

      {showQr && contact.portfolio ? (
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
