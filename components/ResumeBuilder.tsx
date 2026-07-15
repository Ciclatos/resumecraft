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
import { languageOptions, t, type AppLanguage, type TranslationKey } from "../data/i18n";

const storageKey = "resumecraft.builder.v2";
const maxPhotoBytes = 1.5 * 1024 * 1024;
const maxProcessedPhotoBytes = 850 * 1024;
const acceptedPhotoTypes = ["image/jpeg", "image/png", "image/webp"];

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
  descriptionKey: TranslationKey;
  bestForKey: TranslationKey;
}> = [
  {
    id: "modern-sidebar",
    name: "Modern Sidebar",
    descriptionKey: "template.modernSidebar.description",
    bestForKey: "template.modernSidebar.bestFor",
  },
  {
    id: "professional-corporate",
    name: "Professional Corporate",
    descriptionKey: "template.professionalCorporate.description",
    bestForKey: "template.professionalCorporate.bestFor",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    descriptionKey: "template.minimalClean.description",
    bestForKey: "template.minimalClean.bestFor",
  },
  {
    id: "creative-tech",
    name: "Creative Tech",
    descriptionKey: "template.creativeTech.description",
    bestForKey: "template.creativeTech.bestFor",
  },
  {
    id: "ats-clean",
    name: "ATS Clean",
    descriptionKey: "template.atsClean.description",
    bestForKey: "template.atsClean.bestFor",
  },
];

const scaleOptions: Array<{ id: TypeScale; labelKey: TranslationKey }> = [
  { id: "compact", labelKey: "option.compact" },
  { id: "normal", labelKey: "option.normal" },
  { id: "wide", labelKey: "option.wide" },
];

const densityOptions: Array<{ id: ResumeDensity; labelKey: TranslationKey }> = [
  { id: "compact", labelKey: "option.compactFeminine" },
  { id: "normal", labelKey: "option.normal" },
  { id: "airy", labelKey: "option.airy" },
];

const fontSizeOptions: Array<{ id: FontSize; labelKey: TranslationKey }> = [
  { id: "small", labelKey: "option.small" },
  { id: "normal", labelKey: "option.normal" },
  { id: "large", labelKey: "option.large" },
];

const visualPresets = [
  {
    id: "compact",
    labelKey: "option.compact",
    settings: {
      typeScale: "compact",
      density: "compact",
      fontSize: "small",
      fontScale: 88,
      lineHeightScale: 92,
      spacingScale: 82,
    },
  },
  {
    id: "normal",
    labelKey: "option.normal",
    settings: {
      typeScale: "normal",
      density: "normal",
      fontSize: "normal",
      fontScale: 100,
      lineHeightScale: 100,
      spacingScale: 100,
    },
  },
  {
    id: "wide",
    labelKey: "option.wide",
    settings: {
      typeScale: "wide",
      density: "airy",
      fontSize: "normal",
      fontScale: 115,
      lineHeightScale: 112,
      spacingScale: 122,
    },
  },
  {
    id: "extra-wide",
    labelKey: "option.extraWide",
    settings: {
      typeScale: "wide",
      density: "airy",
      fontSize: "large",
      fontScale: 135,
      lineHeightScale: 130,
      spacingScale: 140,
    },
  },
] satisfies Array<{
  id: string;
  labelKey: TranslationKey;
  settings: Pick<
    BuilderSettings,
    "typeScale" | "density" | "fontSize" | "fontScale" | "lineHeightScale" | "spacingScale"
  >;
}>;

export function ResumeBuilder() {
  const [resume, setResume] = useState<ResumeData>(exampleResumeData);
  const [settings, setSettings] = useState<BuilderSettings>(defaultBuilderSettings);
  const [loaded, setLoaded] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const language = settings.language;

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
      try {
        window.localStorage.setItem(storageKey, JSON.stringify({ resume, settings }));
      } catch {
        setPhotoError(
          language === "en"
            ? "Could not save locally. Try a lighter photo or remove the current photo."
            : "No se pudo guardar localmente. Prueba con una foto más ligera o quita la foto actual.",
        );
      }
    }
  }, [language, loaded, resume, settings]);

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
    setSettings((current) => ({ ...defaultBuilderSettings, language: current.language }));
    setPhotoError("");
    window.localStorage.removeItem(storageKey);
  }

  function loadExample() {
    setResume(exampleResumeData);
    setSettings((current) => ({ ...defaultBuilderSettings, language: current.language }));
    setPhotoError("");
  }

  function applyVisualPreset(next: (typeof visualPresets)[number]["settings"]) {
    updateSettings(next);
  }

  async function handlePhoto(file: File | undefined) {
    setPhotoError("");

    if (!file) {
      return;
    }

    if (!acceptedPhotoTypes.includes(file.type)) {
      setPhotoError(
        language === "en" ? "Use a JPG, PNG or WEBP image." : "Usa una imagen JPG, PNG o WEBP.",
      );
      return;
    }

    if (file.size > maxPhotoBytes) {
      setPhotoError(
        language === "en"
          ? "The image is larger than 1.5 MB. Use a lighter photo to save it in this browser."
          : "La imagen supera 1.5 MB. Usa una foto más ligera para guardarla en este navegador.",
      );
      return;
    }

    try {
      const photo = await fileToOptimizedDataUrl(file);

      if (photo.length > maxProcessedPhotoBytes) {
        setPhotoError(
          language === "en"
            ? "The photo is still too large after optimization. Try a smaller image."
            : "La foto sigue siendo pesada después de optimizarla. Prueba otra imagen más pequeña.",
        );
        return;
      }

      update({ photo });
    } catch {
      setPhotoError(
        language === "en"
          ? "Could not read the image. Try another JPG, PNG or WEBP file."
          : "No se pudo leer la imagen. Intenta con otro archivo JPG, PNG o WEBP.",
      );
    }
  }

  return (
    <div className="builder-page">
      <header className="builder-header">
        <Link href="/" className="brand-link">
          ResumeCraft
        </Link>
        <div className="builder-header-actions">
          <Link href="/cv/base">{t(language, "nav.demo")}</Link>
          <a href="https://github.com/Ciclatos/resumecraft">GitHub</a>
        </div>
      </header>

      <div className="builder-workspace">
        <form className="builder-panel" aria-label={t(language, "builder.aria")}>
          <div className="builder-panel-head">
            <h1>{t(language, "builder.title")}</h1>
            <p>{t(language, "builder.description")}</p>
          </div>

          <SegmentedControl
            label={t(language, "settings.language")}
            value={settings.language}
            options={languageOptions}
            onChange={(nextLanguage) => updateSettings({ language: nextLanguage })}
          />

          <TemplateSelector
            language={language}
            selected={settings.template}
            onChange={(template) => updateSettings({ template })}
          />

          <section className="editor-section editor-section-tight">
            <h2>{t(language, "settings.presets")}</h2>
            <div className="segmented-control segmented-control-four">
              {visualPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyVisualPreset(preset.settings)}
                >
                  {t(language, preset.labelKey)}
                </button>
              ))}
            </div>
          </section>

          <SegmentedControl
            label={t(language, "settings.autoFit")}
            value={settings.typeScale}
            options={scaleOptions}
            language={language}
            onChange={(typeScale) => updateSettings({ typeScale })}
          />

          <SegmentedControl
            label={t(language, "settings.fontSize")}
            value={settings.fontSize}
            options={fontSizeOptions}
            language={language}
            onChange={(fontSize) => updateSettings({ fontSize })}
          />

          <RangeSlider
            label={t(language, "settings.fontScale")}
            value={settings.fontScale}
            min={80}
            max={135}
            suffix="%"
            onChange={(fontScale) => updateSettings({ fontScale })}
          />

          <RangeSlider
            label={t(language, "settings.lineHeight")}
            value={settings.lineHeightScale}
            min={90}
            max={130}
            suffix="%"
            onChange={(lineHeightScale) => updateSettings({ lineHeightScale })}
          />

          <RangeSlider
            label={t(language, "settings.spacing")}
            value={settings.spacingScale}
            min={80}
            max={140}
            suffix="%"
            onChange={(spacingScale) => updateSettings({ spacingScale })}
          />

          <SegmentedControl
            label={t(language, "settings.density")}
            value={settings.density}
            options={densityOptions}
            language={language}
            onChange={(density) => updateSettings({ density })}
          />

          <section className="editor-section editor-section-tight">
            <h2>{t(language, "settings.visuals")}</h2>
            <ToggleControl
              checked={settings.showPhoto}
              label={t(language, "settings.showPhoto")}
              onChange={(showPhoto) => updateSettings({ showPhoto })}
            />
            <ToggleControl
              checked={settings.showQr}
              label={t(language, "settings.showQr")}
              onChange={(showQr) => updateSettings({ showQr })}
            />
          </section>

          <section className="editor-section">
            <h2>{t(language, "settings.mainData")}</h2>
            <Field label={t(language, "field.name")}>
              <input value={resume.name} onChange={(event) => update({ name: event.target.value })} />
            </Field>

            <Field label={t(language, "field.headline")}>
              <input
                value={resume.headline}
                onChange={(event) => update({ headline: event.target.value })}
              />
            </Field>

            <PhotoField
              language={language}
              photo={resume.photo ?? ""}
              error={photoError}
              onFile={handlePhoto}
              onClear={() => update({ photo: "" })}
            />

            <div className="field-grid">
              <Field label={t(language, "field.email")}>
                <input
                  type="email"
                  value={resume.contact.email}
                  onChange={(event) => updateContact("email", event.target.value)}
                />
              </Field>
              <Field label={t(language, "field.phone")}>
                <input
                  value={resume.contact.phone}
                  onChange={(event) => updateContact("phone", event.target.value)}
                />
              </Field>
            </div>

            <Field label={t(language, "field.location")}>
              <input
                value={resume.contact.location}
                onChange={(event) => updateContact("location", event.target.value)}
              />
            </Field>

            <Field label={t(language, "field.portfolio")}>
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

            <Field label={t(language, "field.summary")}>
              <textarea
                rows={5}
                value={resume.summary}
                onChange={(event) => update({ summary: event.target.value })}
              />
            </Field>
          </section>

          <TextListEditor
            language={language}
            title={t(language, "section.focus")}
            items={resume.focus}
            addLabel={t(language, "actions.addFocus")}
            onChange={(focus) => update({ focus })}
          />

          <ExperienceEditor
            language={language}
            items={resume.sections.experience}
            onChange={(experience) => updateSections({ experience })}
          />

          <EducationEditor
            language={language}
            items={resume.sections.education}
            onChange={(education) => updateSections({ education })}
          />

          <ProjectEditor
            language={language}
            items={resume.sections.projects}
            onChange={(projects) => updateSections({ projects })}
          />

          <TextListEditor
            language={language}
            title={t(language, "section.skills")}
            items={resume.sections.skills}
            addLabel={t(language, "actions.addSkill")}
            onChange={(skills) => updateSections({ skills })}
          />

          <TextListEditor
            language={language}
            title={t(language, "section.tools")}
            items={resume.sections.tools}
            addLabel={t(language, "actions.addTool")}
            onChange={(tools) => updateSections({ tools })}
          />

          <LanguageEditor
            language={language}
            items={resume.sections.languages}
            onChange={(languages) => updateSections({ languages })}
          />

          <div className="builder-actions">
            <button type="button" onClick={loadExample}>
              <Wand2 size={16} aria-hidden="true" />
              {t(language, "actions.loadExample")}
            </button>
            <button type="button" onClick={resetData}>
              <RotateCcw size={16} aria-hidden="true" />
              {t(language, "actions.reset")}
            </button>
          </div>
        </form>

        <div className="builder-preview">
          <Resume
            data={resume}
            language={language}
            label={templateOptions.find((item) => item.id === settings.template)?.name}
            template={settings.template}
            typeScale={settings.typeScale}
            density={settings.density}
            fontSize={settings.fontSize}
            fontScale={settings.fontScale}
            lineHeightScale={settings.lineHeightScale}
            spacingScale={settings.spacingScale}
            showDemoLinks={false}
            showPhoto={settings.showPhoto}
            showQr={settings.showQr && Boolean(resume.contact.portfolio)}
            actions={
              <>
                <button className="toolbar-button" type="button" onClick={loadExample}>
                  <Wand2 size={16} aria-hidden="true" />
                  {t(language, "actions.loadExample")}
                </button>
                <button className="toolbar-button" type="button" onClick={resetData}>
                  <RotateCcw size={16} aria-hidden="true" />
                  {t(language, "actions.resetShort")}
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
  language,
  selected,
  onChange,
}: {
  language: AppLanguage;
  selected: ResumeTemplate;
  onChange: (template: ResumeTemplate) => void;
}) {
  return (
    <section className="editor-section">
      <h2>{t(language, "settings.template")}</h2>
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
            <small>{t(language, template.descriptionKey)}</small>
            <span>{t(language, template.bestForKey)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function RangeSlider({
  label,
  value,
  min,
  max,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <section className="editor-section editor-section-tight">
      <div className="range-title">
        <h2>{label}</h2>
        <strong>
          {value}
          {suffix}
        </strong>
      </div>
      <input
        aria-label={label}
        className="scale-slider"
        max={max}
        min={min}
        step={1}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </section>
  );
}

function ToggleControl({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="toggle-control">
      <span>{label}</span>
      <input
        checked={checked}
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

function SegmentedControl<T extends string>({
  language,
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ id: T; label?: string; labelKey?: TranslationKey }>;
  language?: AppLanguage;
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
            {option.labelKey ? t(language, option.labelKey) : option.label}
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
  language,
  photo,
  error,
  onFile,
  onClear,
}: {
  language: AppLanguage;
  photo: string;
  error: string;
  onFile: (file: File | undefined) => void;
  onClear: () => void;
}) {
  return (
    <div className="photo-field">
      <div className="photo-dropzone">
        {photo ? (
          <img src={photo} alt={t(language, "photo.alt")} />
        ) : (
          <ImagePlus size={28} aria-hidden="true" />
        )}
        <label>
          <strong>{t(language, "photo.upload")}</strong>
          <span>{t(language, "photo.help")}</span>
          <input
            accept="image/jpeg,image/png,image/webp"
            type="file"
            onChange={(event) => {
              onFile(event.target.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
        </label>
      </div>
      {photo ? (
        <button className="text-button" type="button" onClick={onClear}>
          {t(language, "photo.clear")}
        </button>
      ) : null}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("file-read-error"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image-load-error"));
    image.src = src;
  });
}

async function fileToOptimizedDataUrl(file: File) {
  const originalDataUrl = await fileToDataUrl(file);
  const image = await loadImage(originalDataUrl);
  const maxSize = 720;
  const ratio = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * ratio));
  const height = Math.max(1, Math.round(image.naturalHeight * ratio));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    return originalDataUrl;
  }

  canvas.width = width;
  canvas.height = height;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.86);
}

function TextListEditor({
  language,
  title,
  items,
  addLabel,
  onChange,
}: {
  language: AppLanguage;
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
            <IconButton
              label={t(language, "actions.remove")}
              onClick={() => removeItem(items, index, onChange)}
            />
          </div>
        ))}
      </div>
      <AddButton label={addLabel} onClick={() => onChange([...items, ""])} />
    </section>
  );
}

function ExperienceEditor({
  language,
  items,
  onChange,
}: {
  language: AppLanguage;
  items: ResumeEntry[];
  onChange: (items: ResumeEntry[]) => void;
}) {
  return (
    <section className="editor-section">
      <h2>{t(language, "section.experience")}</h2>
      <div className="item-stack">
        {items.map((item, index) => (
          <EditorCard
            key={`experience-${index}`}
            index={index}
            total={items.length}
            language={language}
            onMove={(direction) => moveItem(items, index, direction, onChange)}
            onRemove={() => removeItem(items, index, onChange)}
          >
            <Field label={t(language, "field.role")}>
              <input value={item.title} onChange={(event) => updateEntry(items, index, "title", event.target.value, onChange)} />
            </Field>
            <Field label={t(language, "field.organization")}>
              <input value={item.organization} onChange={(event) => updateEntry(items, index, "organization", event.target.value, onChange)} />
            </Field>
            <Field label={t(language, "field.period")}>
              <input value={item.period} onChange={(event) => updateEntry(items, index, "period", event.target.value, onChange)} />
            </Field>
            <Field label={t(language, "field.description")}>
              <textarea rows={3} value={item.description} onChange={(event) => updateEntry(items, index, "description", event.target.value, onChange)} />
            </Field>
          </EditorCard>
        ))}
      </div>
      <AddButton
        label={t(language, "actions.addExperience")}
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
  language,
  items,
  onChange,
}: {
  language: AppLanguage;
  items: ResumeEducation[];
  onChange: (items: ResumeEducation[]) => void;
}) {
  return (
    <section className="editor-section">
      <h2>{t(language, "section.education")}</h2>
      <div className="item-stack">
        {items.map((item, index) => (
          <EditorCard
            key={`education-${index}`}
            index={index}
            total={items.length}
            language={language}
            onMove={(direction) => moveItem(items, index, direction, onChange)}
            onRemove={() => removeItem(items, index, onChange)}
          >
            <Field label={t(language, "field.title")}>
              <input value={item.degree} onChange={(event) => updateEducation(items, index, "degree", event.target.value, onChange)} />
            </Field>
            <Field label={t(language, "field.institution")}>
              <input value={item.institution} onChange={(event) => updateEducation(items, index, "institution", event.target.value, onChange)} />
            </Field>
            <Field label={t(language, "field.period")}>
              <input value={item.period} onChange={(event) => updateEducation(items, index, "period", event.target.value, onChange)} />
            </Field>
            <Field label={t(language, "field.detail")}>
              <textarea rows={3} value={item.detail} onChange={(event) => updateEducation(items, index, "detail", event.target.value, onChange)} />
            </Field>
          </EditorCard>
        ))}
      </div>
      <AddButton
        label={t(language, "actions.addEducation")}
        onClick={() =>
          onChange([...items, { degree: "", institution: "", period: "", detail: "" }])
        }
      />
    </section>
  );
}

function ProjectEditor({
  language,
  items,
  onChange,
}: {
  language: AppLanguage;
  items: ResumeProject[];
  onChange: (items: ResumeProject[]) => void;
}) {
  return (
    <section className="editor-section">
      <h2>{t(language, "section.projects")}</h2>
      <div className="item-stack">
        {items.map((item, index) => (
          <EditorCard
            key={`project-${index}`}
            index={index}
            total={items.length}
            language={language}
            onMove={(direction) => moveItem(items, index, direction, onChange)}
            onRemove={() => removeItem(items, index, onChange)}
          >
            <Field label={t(language, "field.name")}>
              <input value={item.name} onChange={(event) => updateProject(items, index, "name", event.target.value, onChange)} />
            </Field>
            <Field label={t(language, "field.description")}>
              <textarea rows={3} value={item.description} onChange={(event) => updateProject(items, index, "description", event.target.value, onChange)} />
            </Field>
          </EditorCard>
        ))}
      </div>
      <AddButton
        label={t(language, "actions.addProject")}
        onClick={() => onChange([...items, { name: "", description: "" }])}
      />
    </section>
  );
}

function LanguageEditor({
  language,
  items,
  onChange,
}: {
  language: AppLanguage;
  items: ResumeLanguage[];
  onChange: (items: ResumeLanguage[]) => void;
}) {
  return (
    <section className="editor-section">
      <h2>{t(language, "section.languages")}</h2>
      <div className="item-stack">
        {items.map((item, index) => (
          <div className="inline-item" key={`language-${index}`}>
            <input
              aria-label={t(language, "field.language")}
              value={item.name}
              onChange={(event) => updateLanguage(items, index, "name", event.target.value, onChange)}
            />
            <input
              aria-label={t(language, "field.level")}
              value={item.level}
              onChange={(event) => updateLanguage(items, index, "level", event.target.value, onChange)}
            />
            <IconButton
              label={t(language, "actions.remove")}
              onClick={() => removeItem(items, index, onChange)}
            />
          </div>
        ))}
      </div>
      <AddButton
        label={t(language, "actions.addLanguage")}
        onClick={() => onChange([...items, { name: "", level: "" }])}
      />
    </section>
  );
}

function EditorCard({
  children,
  index,
  language,
  total,
  onMove,
  onRemove,
}: {
  children: React.ReactNode;
  index: number;
  language: AppLanguage;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <article className="editor-card">
      <div className="editor-card-actions">
        <button
          type="button"
          onClick={() => onMove(-1)}
          disabled={index === 0}
          aria-label={t(language, "actions.moveUp")}
        >
          <ArrowUp size={14} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          disabled={index === total - 1}
          aria-label={t(language, "actions.moveDown")}
        >
          <ArrowDown size={14} aria-hidden="true" />
        </button>
        <button type="button" onClick={onRemove} aria-label={t(language, "actions.remove")}>
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
