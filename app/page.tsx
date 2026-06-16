import Link from "next/link";
import type { ComponentType } from "react";
import {
  Download,
  FileText,
  Github,
  LockKeyhole,
  PencilLine,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <main className="home-page">
      <nav className="home-nav" aria-label="Navegación principal">
        <Link href="/" className="brand-link">
          ResumeCraft
        </Link>
        <div>
          <Link href="/builder">Crear CV</Link>
          <Link href="/cv/base">Demo</Link>
          <a href="https://github.com/Ciclatos/resumecraft">GitHub</a>
        </div>
      </nav>

      <section className="home-hero">
        <div className="hero-copy">
          <p className="kicker">Open source CV builder</p>
          <h1>ResumeCraft</h1>
          <p>
            Crea CVs profesionales, editables y exportables a PDF directamente
            desde el navegador. Sin login, sin backend y con datos guardados de
            forma local.
          </p>
          <div className="hero-actions">
            <Link href="/builder" className="primary-action">
              <PencilLine size={18} aria-hidden="true" />
              Crear CV
            </Link>
            <Link href="/cv/base">Ver demo</Link>
            <a href="https://github.com/Ciclatos/resumecraft">
              <Github size={18} aria-hidden="true" />
              GitHub
            </a>
          </div>
        </div>

        <div className="hero-preview" aria-hidden="true">
          <div className="mini-resume">
            <aside />
            <section>
              <span />
              <strong />
              <p />
              <p />
              <div />
              <div />
            </section>
          </div>
        </div>
      </section>

      <section className="feature-band" aria-label="Características">
        <Feature
          icon={PencilLine}
          title="Editable"
          text="Modifica nombre, resumen, experiencia, educación, habilidades, herramientas, idiomas y proyectos."
        />
        <Feature
          icon={Download}
          title="Exportable"
          text="Usa los estilos de impresión existentes para generar un PDF desde el navegador."
        />
        <Feature
          icon={LockKeyhole}
          title="Privado"
          text="Los datos se quedan en localStorage o en archivos de configuración. No hay login ni servidor."
        />
        <Feature
          icon={Sparkles}
          title="Extensible"
          text="Incluye una plantilla moderna con columna lateral y una base lista para más plantillas."
        />
      </section>

      <section className="demo-band">
        <div>
          <p className="kicker">Demos incluidas</p>
          <h2>Las rutas personales ahora viven como ejemplos.</h2>
          <p>
            ResumeCraft conserva el CV original como demo pública del motor de
            plantillas, separado del builder principal.
          </p>
        </div>
        <div className="demo-links">
          <Link href="/cv/base">
            <FileText size={18} aria-hidden="true" />
            Base
          </Link>
          <Link href="/cv/edteam">
            <FileText size={18} aria-hidden="true" />
            EDteam
          </Link>
          <Link href="/cv/walmart">
            <FileText size={18} aria-hidden="true" />
            Walmart
          </Link>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  text: string;
}) {
  return (
    <article className="feature-item">
      <span className="icon-badge" aria-hidden="true">
        <Icon size={16} strokeWidth={2.3} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  );
}
