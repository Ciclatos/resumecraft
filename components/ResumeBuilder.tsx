"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Plus,
  RotateCcw,
  Trash2,
  Wand2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Resume } from "./Resume";
import {
  defaultBuilderSettings,
  exampleResumeData,
  type BuilderSettings,
  type FontSize,
  type ResumeData,
  type ResumeDensity,
  type ResumeEducation,
  type ResumeEntry,
  type ResumeLanguage,
  type ResumeProject,
  type ResumeTemplate,
  type TypeScale,
} from "../data/resume";

const storageKey = "resumecraft.builder.v2";
const maxPhotoBytes = 1.5 * 1024 * 1024;

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

const templateOptions: Array<{
  id: ResumeTemplate;
  name: string;
  description: string;
  bestFor: string;
}> = [
  {
    id: "modern-sidebar",
    name: "Modern Sidebar",
    description: "General moderno con identidad visual fuerte.",
    bestFor: "general moderno",
  },
  {
    id: "professional-corporate",
    name: "Professional Corporate",
    description: "Tradicional, sobria y fuerte para empresas grandes.",
    bestFor: "empresas tradicionales",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Limpia, técnica y con lectura muy cómoda.",
    bestFor: "tecnología / limpio",
  },
  {
    id: "creative-tech",
    name: "Creative Tech",
    description: "Moderna, visual y orientada a producto o portafolio.",
    bestFor: "portafolio / tech creativo",
  },
  {
    id: "ats-clean",
    name: "ATS Clean",
    description: "Lineal, simple y optimizada para lectura automática.",
    bestFor: "portales de empleo / ATS",
  },
];

const scaleOptions: Array<{ id: TypeScale; label: string }> = [
  { id: "compact", label: "Compacto" },
  { id: "normal", label: "Normal" },
  { id: "wide", label: "Amplio" },
];

const densityOptions: Array<{ id: ResumeDensity; label: string }> = [
  { id: "compact", label: "Compacta" },
  { id: "normal", label: "Normal" },
  { id: "airy", label: "Aireada" },
];

const fontSizeOptions: Array<{ id: FontSize; label: string }> = [
  { id: "small", label: "Pequeño" },
  { id: "normal", label: "Normal" },
  { id: "large", label: "Grande" },
];

export function ResumeBuilder() {
  const [resume, setResume] = useState<ResumeData>(exampleResumeData);
  const [settings, setSettings] = useState<BuilderSettings>(defaultBuilderSettings);
  const [loaded, setLoaded] = useState(false);
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          resume?: ResumeData;
          settings?: BuilderSettings;
        };
        setResume(parsed.resume ?? exampleResumeData);
        setSettings({ ...defaultBuilderSettings, ...parsed.settings });
      } catch {
        setResume(exampleResumeData);
        setSettings(defaultBuilderSettings);
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(storageKey, JSON.stringify({ resume, settings }));
    }
  }, [loaded, resume, settings]);

  function update(next: Partial<ResumeData>) {
    setResume((current) => ({ ...current, ...next }));
  }

  function updateContact(field: keyof ResumeData["contact"], value: string) {
    setResume((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value },
    }));
  }

  function updateSettings(next: Partial<BuilderSettings>) {
    setSettings((current) => ({ ...current, ...next }));
  }

  function updateSections(next: Partial<ResumeData["sections"]>) {
    setResume((current) => ({
      ...current,
      sections: { ...current.sections, ...next },
    }));
  }

  function resetData() {
    setResume(emptyResumeData);
    setSettings(defaultBuilderSettings);
    setPhotoError("");
    window.localStorage.removeItem(storageKey);
  }

  function loadExample() {
    setResume(exampleResumeData);
    setSettings(defaultBuilderSettings);
    setPhotoError("");
  }

  function handlePhoto(file: File | undefined) {
    setPhotoError("");

    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Usa una imagen JPG, PNG o WEBP.");
      return;
    }

    if (file.size > maxPhotoBytes) {
      setPhotoError("La imagen supera 1.5 MB. Elige una versión más ligera.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      update({ photo: String(reader.result) });
    };
    reader.readAsDataURL(file);
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
          <div className="builder-panel-head">
            <h1>Builder</h1>
            <p>
              Crea un CV profesional sin login. Todo se guarda localmente en este
              navegador.
            </p>
          </div>

          <TemplateSelector
            selected={settings.template}
            onChange={(template) => updateSettings({ template })}
          />

          <SegmentedControl
            label="Auto fit visual"
            value={settings.typeScale}
            options={scaleOptions}
            onChange={(typeScale) => updateSettings({ typeScale })}
          />

          <SegmentedControl
            label="Tamaño de letra"
            value={settings.fontSize}
            options={fontSizeOptions}
            onChange={(fontSize) => updateSettings({ fontSize })}
          />

          <SegmentedControl
            label="Densidad"
            value={settings.density}
            options={densityOptions}
            onChange={(density) => updateSettings({ density })}
          />

          <section className="editor-section">
            <h2>Datos principales</h2>
            <Field label="Nombre">
              <input value={resume.name} onChange={(event) => update({ name: event.target.value })} />
            </Field>

            <Field label="Titular profesional">
              <input
                value={resume.headline}
                onChange={(event) => update({ headline: event.target.value })}
              />
            </Field>

            <PhotoField
              photo={resume.photo ?? ""}
              error={photoError}
              onFile={handlePhoto}
              onClear={() => update({ photo: "" })}
            />

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
          </section>

          <TextListEditor
            title="Enfoques principales"
            items={resume.focus}
            addLabel="Agregar enfoque"
            onChange={(focus) => update({ focus })}
          />

          <ExperienceEditor
            items={resume.sections.experience}
            onChange={(experience) => updateSections({ experience })}
          />

          <EducationEditor
            items={resume.sections.education}
            onChange={(education) => updateSections({ education })}
          />

          <ProjectEditor
            items={resume.sections.projects}
            onChange={(projects) => updateSections({ projects })}
          />

          <TextListEditor
            title="Habilidades"
            items={resume.sections.skills}
            addLabel="Agregar habilidad"
            onChange={(skills) => updateSections({ skills })}
          />

          <TextListEditor
            title="Herramientas"
            items={resume.sections.tools}
            addLabel="Agregar herramienta"
            onChange={(tools) => updateSections({ tools })}
          />

          <LanguageEditor
            items={resume.sections.languages}
            onChange={(languages) => updateSections({ languages })}
          />

          <div className="builder-actions">
            <button type="button" onClick={loadExample}>
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
            label={templateOptions.find((item) => item.id === settings.template)?.name}
            template={settings.template}
            typeScale={settings.typeScale}
            density={settings.density}
            fontSize={settings.fontSize}
            showDemoLinks={false}
            showQr={Boolean(resume.contact.portfolio)}
            actions={
              <>
                <button className="toolbar-button" type="button" onClick={loadExample}>
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

function TemplateSelector({
  selected,
  onChange,
}: {
  selected: ResumeTemplate;
  onChange: (template: ResumeTemplate) => void;
}) {
  return (
    <section className="editor-section">
      <h2>Plantilla</h2>
      <div className="template-grid">
        {templateOptions.map((template) => (
          <button
            className={selected === template.id ? "template-option is-selected" : "template-option"}
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
          >
            <span className={`template-preview template-preview-${template.id}`}>
              <i />
              <b />
              <em />
            </span>
            <strong>{template.name}</strong>
            <small>{template.description}</small>
            <span>{template.bestFor}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ id: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <section className="editor-section editor-section-tight">
      <h2>{label}</h2>
      <div className="segmented-control">
        {options.map((option) => (
          <button
            className={value === option.id ? "is-selected" : ""}
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
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

function PhotoField({
  photo,
  error,
  onFile,
  onClear,
}: {
  photo: string;
  error: string;
  onFile: (file: File | undefined) => void;
  onClear: () => void;
}) {
  return (
    <div className="photo-field">
      <div className="photo-dropzone">
        {photo ? <img src={photo} alt="Vista previa de foto" /> : <ImagePlus size={28} aria-hidden="true" />}
        <label>
          <strong>Subir foto</strong>
          <span>JPG, PNG o WEBP hasta 1.5 MB</span>
          <input
            accept="image/jpeg,image/png,image/webp"
            type="file"
            onChange={(event) => onFile(event.target.files?.[0])}
          />
        </label>
      </div>
      {photo ? (
        <button className="text-button" type="button" onClick={onClear}>
          Quitar foto
        </button>
      ) : null}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}

function TextListEditor({
  title,
  items,
  addLabel,
  onChange,
}: {
  title: string;
  items: string[];
  addLabel: string;
  onChange: (items: string[]) => void;
}) {
  return (
    <section className="editor-section">
      <h2>{title}</h2>
      <div className="item-stack">
        {items.map((item, index) => (
          <div className="inline-item" key={`${title}-${index}`}>
            <input
              value={item}
              onChange={(event) => replaceItem(items, index, event.target.value, onChange)}
            />
            <IconButton label="Eliminar" onClick={() => removeItem(items, index, onChange)} />
          </div>
        ))}
      </div>
      <AddButton label={addLabel} onClick={() => onChange([...items, ""])} />
    </section>
  );
}

function ExperienceEditor({
  items,
  onChange,
}: {
  items: ResumeEntry[];
  onChange: (items: ResumeEntry[]) => void;
}) {
  return (
    <section className="editor-section">
      <h2>Experiencia</h2>
      <div className="item-stack">
        {items.map((item, index) => (
          <EditorCard
            key={`experience-${index}`}
            index={index}
            total={items.length}
            onMove={(direction) => moveItem(items, index, direction, onChange)}
            onRemove={() => removeItem(items, index, onChange)}
          >
            <Field label="Cargo">
              <input value={item.title} onChange={(event) => updateEntry(items, index, "title", event.target.value, onChange)} />
            </Field>
            <Field label="Organización">
              <input value={item.organization} onChange={(event) => updateEntry(items, index, "organization", event.target.value, onChange)} />
            </Field>
            <Field label="Periodo">
              <input value={item.period} onChange={(event) => updateEntry(items, index, "period", event.target.value, onChange)} />
            </Field>
            <Field label="Descripción">
              <textarea rows={3} value={item.description} onChange={(event) => updateEntry(items, index, "description", event.target.value, onChange)} />
            </Field>
          </EditorCard>
        ))}
      </div>
      <AddButton
        label="Agregar experiencia"
        onClick={() =>
          onChange([
            ...items,
            { title: "", organization: "", period: "", description: "" },
          ])
        }
      />
    </section>
  );
}

function EducationEditor({
  items,
  onChange,
}: {
  items: ResumeEducation[];
  onChange: (items: ResumeEducation[]) => void;
}) {
  return (
    <section className="editor-section">
      <h2>Educación</h2>
      <div className="item-stack">
        {items.map((item, index) => (
          <EditorCard
            key={`education-${index}`}
            index={index}
            total={items.length}
            onMove={(direction) => moveItem(items, index, direction, onChange)}
            onRemove={() => removeItem(items, index, onChange)}
          >
            <Field label="Título">
              <input value={item.degree} onChange={(event) => updateEducation(items, index, "degree", event.target.value, onChange)} />
            </Field>
            <Field label="Institución">
              <input value={item.institution} onChange={(event) => updateEducation(items, index, "institution", event.target.value, onChange)} />
            </Field>
            <Field label="Periodo">
              <input value={item.period} onChange={(event) => updateEducation(items, index, "period", event.target.value, onChange)} />
            </Field>
            <Field label="Detalle">
              <textarea rows={3} value={item.detail} onChange={(event) => updateEducation(items, index, "detail", event.target.value, onChange)} />
            </Field>
          </EditorCard>
        ))}
      </div>
      <AddButton
        label="Agregar educación"
        onClick={() =>
          onChange([...items, { degree: "", institution: "", period: "", detail: "" }])
        }
      />
    </section>
  );
}

function ProjectEditor({
  items,
  onChange,
}: {
  items: ResumeProject[];
  onChange: (items: ResumeProject[]) => void;
}) {
  return (
    <section className="editor-section">
      <h2>Proyectos</h2>
      <div className="item-stack">
        {items.map((item, index) => (
          <EditorCard
            key={`project-${index}`}
            index={index}
            total={items.length}
            onMove={(direction) => moveItem(items, index, direction, onChange)}
            onRemove={() => removeItem(items, index, onChange)}
          >
            <Field label="Nombre">
              <input value={item.name} onChange={(event) => updateProject(items, index, "name", event.target.value, onChange)} />
            </Field>
            <Field label="Descripción">
              <textarea rows={3} value={item.description} onChange={(event) => updateProject(items, index, "description", event.target.value, onChange)} />
            </Field>
          </EditorCard>
        ))}
      </div>
      <AddButton label="Agregar proyecto" onClick={() => onChange([...items, { name: "", description: "" }])} />
    </section>
  );
}

function LanguageEditor({
  items,
  onChange,
}: {
  items: ResumeLanguage[];
  onChange: (items: ResumeLanguage[]) => void;
}) {
  return (
    <section className="editor-section">
      <h2>Idiomas</h2>
      <div className="item-stack">
        {items.map((item, index) => (
          <div className="inline-item" key={`language-${index}`}>
            <input
              aria-label="Idioma"
              value={item.name}
              onChange={(event) => updateLanguage(items, index, "name", event.target.value, onChange)}
            />
            <input
              aria-label="Nivel"
              value={item.level}
              onChange={(event) => updateLanguage(items, index, "level", event.target.value, onChange)}
            />
            <IconButton label="Eliminar" onClick={() => removeItem(items, index, onChange)} />
          </div>
        ))}
      </div>
      <AddButton label="Agregar idioma" onClick={() => onChange([...items, { name: "", level: "" }])} />
    </section>
  );
}

function EditorCard({
  children,
  index,
  total,
  onMove,
  onRemove,
}: {
  children: React.ReactNode;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <article className="editor-card">
      <div className="editor-card-actions">
        <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Subir">
          <ArrowUp size={14} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Bajar">
          <ArrowDown size={14} aria-hidden="true" />
        </button>
        <button type="button" onClick={onRemove} aria-label="Eliminar">
          <Trash2 size={14} aria-hidden="true" />
        </button>
      </div>
      {children}
    </article>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="add-button" type="button" onClick={onClick}>
      <Plus size={15} aria-hidden="true" />
      {label}
    </button>
  );
}

function IconButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="icon-button" type="button" onClick={onClick} aria-label={label}>
      <Trash2 size={15} aria-hidden="true" />
    </button>
  );
}

function replaceItem<T>(items: T[], index: number, value: T, onChange: (items: T[]) => void) {
  onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)));
}

function removeItem<T>(items: T[], index: number, onChange: (items: T[]) => void) {
  onChange(items.filter((_, itemIndex) => itemIndex !== index));
}

function moveItem<T>(
  items: T[],
  index: number,
  direction: -1 | 1,
  onChange: (items: T[]) => void,
) {
  const nextIndex = index + direction;

  if (nextIndex < 0 || nextIndex >= items.length) {
    return;
  }

  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  onChange(next);
}

function updateEntry(
  items: ResumeEntry[],
  index: number,
  field: keyof ResumeEntry,
  value: string,
  onChange: (items: ResumeEntry[]) => void,
) {
  replaceItem(items, index, { ...items[index], [field]: value }, onChange);
}

function updateEducation(
  items: ResumeEducation[],
  index: number,
  field: keyof ResumeEducation,
  value: string,
  onChange: (items: ResumeEducation[]) => void,
) {
  replaceItem(items, index, { ...items[index], [field]: value }, onChange);
}

function updateProject(
  items: ResumeProject[],
  index: number,
  field: keyof ResumeProject,
  value: string,
  onChange: (items: ResumeProject[]) => void,
) {
  replaceItem(items, index, { ...items[index], [field]: value }, onChange);
}

function updateLanguage(
  items: ResumeLanguage[],
  index: number,
  field: keyof ResumeLanguage,
  value: string,
  onChange: (items: ResumeLanguage[]) => void,
) {
  replaceItem(items, index, { ...items[index], [field]: value }, onChange);
}
