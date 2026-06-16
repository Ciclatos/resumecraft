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
import { QRCode } from "./QRCode";

type SidebarProps = {
  data: ResumeData;
  showQr?: boolean;
};

export function Sidebar({ data, showQr = false }: SidebarProps) {
  const photo = data.photo?.trim();
  const contact = data.contact;
  const portfolioLabel = contact.portfolio.replace(/^https?:\/\//, "");
  const linkedInLabel = contact.linkedIn.replace(/^https?:\/\/(www\.)?/, "");
  const githubLabel = contact.github.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <aside className="sidebar">
      {photo ? (
        <div className="portrait">
          <img src={photo} alt={`Foto profesional de ${data.name}`} />
        </div>
      ) : (
        <div className="portrait portrait-fallback" aria-hidden="true">
          {data.name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")}
        </div>
      )}

      <div className="identity">
        <h1>{data.name}</h1>
        <p>{data.headline}</p>
      </div>

      <SideSection title="Contacto" icon={User}>
        <ul className="contact-list">
          <li>
            <Mail size={14} aria-hidden="true" />
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </li>
          <li>
            <Phone size={14} aria-hidden="true" />
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
          </li>
          <li>
            <MapPin size={14} aria-hidden="true" />
            <span>{contact.location}</span>
          </li>
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
        </ul>
      </SideSection>

      <SideSection title="Habilidades" icon={Sparkles}>
        <ul className="simple-list">
          {data.sections.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </SideSection>

      <SideSection title="Herramientas" icon={Wrench}>
        <ul className="simple-list tool-list">
          {data.sections.tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </SideSection>

      <SideSection title="Idiomas" icon={Languages}>
        <ul className="language-list">
          {data.sections.languages.map((language) => (
            <li key={language.name}>
              <strong>{language.name}</strong>
              {language.level}
            </li>
          ))}
        </ul>
      </SideSection>

      {showQr && contact.portfolio ? (
        <SideSection title="Portafolio" icon={Globe}>
          <QRCode value={contact.portfolio} />
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
