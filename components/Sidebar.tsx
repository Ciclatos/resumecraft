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
import { profile } from "../data/profile";
import type { ResumeVariant } from "../data/variants";
import { QRCode } from "./QRCode";

type SidebarProps = {
  variant: ResumeVariant;
};

export function Sidebar({ variant }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="portrait">
        <img
          src={profile.photo}
          alt="Foto profesional de Carlos Díaz"
        />
      </div>

      <div className="identity">
        <h1>{profile.name}</h1>
        <p>{variant.headline}</p>
      </div>

      <SideSection title="Contacto" icon={User}>
        <ul className="contact-list">
          <li>
            <Mail size={14} aria-hidden="true" />
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>
            <Phone size={14} aria-hidden="true" />
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>
          </li>
          <li>
            <MapPin size={14} aria-hidden="true" />
            <span>{profile.location}</span>
          </li>
          <li>
            <Globe size={14} aria-hidden="true" />
            <a href={profile.portfolio}>{profile.portfolio.replace("https://", "")}</a>
          </li>
          <li>
            <Linkedin size={14} aria-hidden="true" />
            <a href={profile.linkedIn}>linkedin.com/in/carlos-diaz-00a014303/</a>
          </li>
          <li>
            <Github size={14} aria-hidden="true" />
            <a href={profile.github}>github.com/Ciclatos</a>
          </li>
        </ul>
      </SideSection>

      <SideSection title="Habilidades" icon={Sparkles}>
        <ul className="simple-list">
          {variant.sections.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </SideSection>

      <SideSection title="Herramientas" icon={Wrench}>
        <ul className="simple-list tool-list">
          {variant.sections.tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </SideSection>

      <SideSection title="Idiomas" icon={Languages}>
        <ul className="language-list">
          {profile.languages.map((language) => (
            <li key={language.name}>
              <strong>{language.name}</strong>
              {language.level}
            </li>
          ))}
        </ul>
      </SideSection>

      {variant.showQr ? (
        <SideSection title="Portafolio" icon={Globe}>
          <QRCode value={profile.portfolio} />
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
