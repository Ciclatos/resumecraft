"use client";

import Link from "next/link";
import { RotateCcw, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Resume } from "./Resume";
import { exampleResumeData, type ResumeData } from "../data/resume";

const storageKey = "resumecraft.builder.v1";

const emptyResumeData: ResumeData = {
  name: "",
  photo: "",
  headline: "",
  contact: {
    email: "",
    phone: "",
    location: "",
    portfolio: "",
    linkedIn: "",
    github: "",
  },
  summary: "",
  focus: [],
  sections: {
    experience: [],
    projects: [],
    education: [],
    skills: [],
    tools: [],
    languages: [],
  },
};

export function ResumeBuilder() {
  const [resume, setResume] = useState<ResumeData>(exampleResumeData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);

    if (saved) {
      try {
        setResume(JSON.parse(saved) as ResumeData);
      } catch {
        setResume(exampleResumeData);
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(resume));
    }
  }, [loaded, resume]);

  const text = useMemo(() => toFormText(resume), [resume]);

  function update(next: Partial<ResumeData>) {
    setResume((current) => ({ ...current, ...next }));
  }

  function updateContact(field: keyof ResumeData["contact"], value: string) {
    setResume((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value },
    }));
  }

  function updateSections(next: Partial<ResumeData["sections"]>) {
    setResume((current) => ({
      ...current,
      sections: { ...current.sections, ...next },
    }));
  }

  function resetData() {
    setResume(emptyResumeData);
    window.localStorage.removeItem(storageKey);
  }

  return (
    <div className="builder-page">
      <header className="builder-header">
        <Link href="/" className="brand-link">
          ResumeCraft
        </Link>
        <div className="builder-header-actions">
          <Link href="/cv/base">Ver demo</Link>
          <a href="https://github.com/Ciclatos/resumecraft">GitHub</a>
        </div>
      </header>

      <div className="builder-workspace">
        <form className="builder-panel" aria-label="Editor de CV">
          <h1>Builder</h1>
          <p>
            Tus cambios se guardan en este navegador. ResumeCraft no necesita login ni
            envía tus datos a un servidor.
          </p>

          <Field label="Nombre">
            <input value={resume.name} onChange={(event) => update({ name: event.target.value })} />
          </Field>

          <Field label="Titular profesional">
            <input
              value={resume.headline}
              onChange={(event) => update({ headline: event.target.value })}
            />
          </Field>

          <Field label="Foto opcional">
            <input
              placeholder="https://... o /foto.png"
              value={resume.photo ?? ""}
              onChange={(event) => update({ photo: event.target.value })}
            />
          </Field>

          <div className="field-grid">
            <Field label="Email">
              <input
                type="email"
                value={resume.contact.email}
                onChange={(event) => updateContact("email", event.target.value)}
              />
            </Field>
            <Field label="Teléfono">
              <input
                value={resume.contact.phone}
                onChange={(event) => updateContact("phone", event.target.value)}
              />
            </Field>
          </div>

          <Field label="Ubicación">
            <input
              value={resume.contact.location}
              onChange={(event) => updateContact("location", event.target.value)}
            />
          </Field>

          <Field label="Portafolio">
            <input
              value={resume.contact.portfolio}
              onChange={(event) => updateContact("portfolio", event.target.value)}
            />
          </Field>

          <div className="field-grid">
            <Field label="LinkedIn">
              <input
                value={resume.contact.linkedIn}
                onChange={(event) => updateContact("linkedIn", event.target.value)}
              />
            </Field>
            <Field label="GitHub">
              <input
                value={resume.contact.github}
                onChange={(event) => updateContact("github", event.target.value)}
              />
            </Field>
          </div>

          <Field label="Resumen">
            <textarea
              rows={5}
              value={resume.summary}
              onChange={(event) => update({ summary: event.target.value })}
            />
          </Field>

          <Field label="Enfoques principales">
            <textarea
              rows={4}
              value={text.focus}
              onChange={(event) => update({ focus: lines(event.target.value) })}
            />
          </Field>

          <Field label="Experiencia">
            <textarea
              rows={8}
              value={text.experience}
              onChange={(event) =>
                updateSections({ experience: parseEntries(event.target.value) })
              }
            />
          </Field>

          <Field label="Educación">
            <textarea
              rows={5}
              value={text.education}
              onChange={(event) =>
                updateSections({ education: parseEducation(event.target.value) })
              }
            />
          </Field>

          <Field label="Habilidades">
            <textarea
              rows={5}
              value={text.skills}
              onChange={(event) => updateSections({ skills: lines(event.target.value) })}
            />
          </Field>

          <Field label="Herramientas">
            <textarea
              rows={5}
              value={text.tools}
              onChange={(event) => updateSections({ tools: lines(event.target.value) })}
            />
          </Field>

          <Field label="Idiomas">
            <textarea
              rows={4}
              value={text.languages}
              onChange={(event) => updateSections({ languages: parseLanguages(event.target.value) })}
            />
          </Field>

          <Field label="Proyectos">
            <textarea
              rows={6}
              value={text.projects}
              onChange={(event) => updateSections({ projects: parseProjects(event.target.value) })}
            />
          </Field>

          <div className="builder-actions">
            <button type="button" onClick={() => setResume(exampleResumeData)}>
              <Wand2 size={16} aria-hidden="true" />
              Cargar ejemplo
            </button>
            <button type="button" onClick={resetData}>
              <RotateCcw size={16} aria-hidden="true" />
              Resetear
            </button>
          </div>
        </form>

        <div className="builder-preview">
          <Resume
            data={resume}
            label="Plantilla moderna"
            showDemoLinks={false}
            showQr={Boolean(resume.contact.portfolio)}
            actions={
              <>
                <button className="toolbar-button" type="button" onClick={() => setResume(exampleResumeData)}>
                  <Wand2 size={16} aria-hidden="true" />
                  Ejemplo
                </button>
                <button className="toolbar-button" type="button" onClick={resetData}>
                  <RotateCcw size={16} aria-hidden="true" />
                  Reset
                </button>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="builder-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseRows(value: string, size: number) {
  return lines(value).map((line) => {
    const parts = line.split("|").map((part) => part.trim());
    return Array.from({ length: size }, (_, index) => parts[index] ?? "");
  });
}

function parseEntries(value: string) {
  return parseRows(value, 4).map(([title, organization, period, description]) => ({
    title,
    organization,
    period,
    description,
  }));
}

function parseEducation(value: string) {
  return parseRows(value, 4).map(([degree, institution, period, detail]) => ({
    degree,
    institution,
    period,
    detail,
  }));
}

function parseProjects(value: string) {
  return parseRows(value, 2).map(([name, description]) => ({ name, description }));
}

function parseLanguages(value: string) {
  return parseRows(value, 2).map(([name, level]) => ({ name, level }));
}

function toFormText(resume: ResumeData) {
  return {
    focus: resume.focus.join("\n"),
    experience: resume.sections.experience
      .map((entry) => [entry.title, entry.organization, entry.period, entry.description].join(" | "))
      .join("\n"),
    education: resume.sections.education
      .map((entry) => [entry.degree, entry.institution, entry.period, entry.detail].join(" | "))
      .join("\n"),
    skills: resume.sections.skills.join("\n"),
    tools: resume.sections.tools.join("\n"),
    languages: resume.sections.languages.map((language) => [language.name, language.level].join(" | ")).join("\n"),
    projects: resume.sections.projects.map((project) => [project.name, project.description].join(" | ")).join("\n"),
  };
}
