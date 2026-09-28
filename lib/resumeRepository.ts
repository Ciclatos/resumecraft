import {
  defaultBuilderSettings,
  type BuilderSettings,
  type ResumeData,
} from "../data/resume";

export const resumeLibraryStorageKey = "resumecraft.resumes.v3";
export const resumeLibraryRecoveryKey = "resumecraft.resumes.v3.recovery";
export const legacyBuilderStorageKey = "resumecraft.builder.v2";
export const resumeLibraryVersion = 3 as const;

export type ResumeContent = {
  resume: ResumeData;
  settings: BuilderSettings;
};

export type SavedResume = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  data: ResumeContent;
};

export type ResumeLibrary = {
  version: typeof resumeLibraryVersion;
  activeResumeId: string;
  resumes: SavedResume[];
};

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

export class ResumeStorageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ResumeStorageError";
  }
}

export function createEmptyResumeData(): ResumeData {
  return {
    name: "",
    photo: "",
    headline: "",
    contact: { email: "", phone: "", location: "", portfolio: "", linkedIn: "", github: "" },
    summary: "",
    focus: [],
    sections: { experience: [], projects: [], education: [], skills: [], tools: [], languages: [] },
  };
}

export class ResumeRepository {
  constructor(
    private readonly storage: StorageLike,
    private readonly now: () => Date = () => new Date(),
    private readonly createId: () => string = generateId,
  ) {}

  getLibrary(): ResumeLibrary {
    const current = this.readCurrentLibrary();
    if (current) return current;

    const migrated = this.readLegacyResume();
    const first = this.buildResume(migrated ?? this.blankContent(), "Mi CV");
    const library: ResumeLibrary = {
      version: resumeLibraryVersion,
      activeResumeId: first.id,
      resumes: [first],
    };
    this.writeLibrary(library);
    return clone(library);
  }

  getAllResumes() {
    return this.getLibrary().resumes;
  }

  getResumeById(id: string) {
    return this.getLibrary().resumes.find((resume) => resume.id === id) ?? null;
  }

  createResume(name = "Nuevo CV", data: ResumeContent = this.blankContent()) {
    const library = this.getLibrary();
    const resume = this.buildResume(data, cleanName(name, "Nuevo CV"));
    library.resumes.push(resume);
    library.activeResumeId = resume.id;
    this.writeLibrary(library);
    return clone(resume);
  }

  updateResume(id: string, data: ResumeContent) {
    const library = this.getLibrary();
    const index = library.resumes.findIndex((resume) => resume.id === id);
    if (index < 0) throw new ResumeStorageError("Resume not found");
    const current = library.resumes[index];
    const updated = { ...current, updatedAt: this.timestamp(), data: clone(data) };
    library.resumes[index] = updated;
    this.writeLibrary(library);
    return clone(updated);
  }

  renameResume(id: string, name: string) {
    const library = this.getLibrary();
    const item = library.resumes.find((resume) => resume.id === id);
    if (!item) throw new ResumeStorageError("Resume not found");
    item.name = cleanName(name, item.name);
    item.updatedAt = this.timestamp();
    this.writeLibrary(library);
    return clone(item);
  }

  duplicateResume(id: string) {
    const library = this.getLibrary();
    const source = library.resumes.find((resume) => resume.id === id);
    if (!source) throw new ResumeStorageError("Resume not found");
    const duplicate = this.buildResume(source.data, `${source.name} - Copia`);
    library.resumes.push(duplicate);
    library.activeResumeId = duplicate.id;
    this.writeLibrary(library);
    return clone(duplicate);
  }

  importResume(value: unknown, name?: string) {
    const content = parseImport(value);
    if (!content) throw new ResumeStorageError("Invalid ResumeCraft resume file");
    return this.createResume(name ?? importName(value) ?? "CV importado", content);
  }

  deleteResume(id: string) {
    const library = this.getLibrary();
    const index = library.resumes.findIndex((resume) => resume.id === id);
    if (index < 0) throw new ResumeStorageError("Resume not found");
    library.resumes.splice(index, 1);
    if (library.resumes.length === 0) {
      const replacement = this.buildResume(this.blankContent(), "Nuevo CV");
      library.resumes.push(replacement);
    }
    if (!library.resumes.some((resume) => resume.id === library.activeResumeId)) {
      library.activeResumeId = library.resumes[Math.min(index, library.resumes.length - 1)].id;
    }
    this.writeLibrary(library);
    return clone(library);
  }

  getActiveResumeId() {
    return this.getLibrary().activeResumeId;
  }

  setActiveResume(id: string) {
    const library = this.getLibrary();
    if (!library.resumes.some((resume) => resume.id === id)) {
      throw new ResumeStorageError("Resume not found");
    }
    library.activeResumeId = id;
    this.writeLibrary(library);
  }

  private blankContent(): ResumeContent {
    return { resume: createEmptyResumeData(), settings: { ...defaultBuilderSettings } };
  }

  private buildResume(data: ResumeContent, name: string): SavedResume {
    const timestamp = this.timestamp();
    return { id: this.uniqueId(), name, createdAt: timestamp, updatedAt: timestamp, data: clone(data) };
  }

  private uniqueId() {
    const existing = new Set(this.readCurrentLibrary()?.resumes.map((resume) => resume.id) ?? []);
    let id = this.createId();
    while (existing.has(id)) id = this.createId();
    return id;
  }

  private timestamp() {
    return this.now().toISOString();
  }

  private readCurrentLibrary(): ResumeLibrary | null {
    const raw = this.safeGet(resumeLibraryStorageKey);
    if (!raw) return null;
    try {
      const library = normalizeLibrary(JSON.parse(raw));
      if (library) return library;
      this.backupUnreadableLibrary(raw);
      console.error("ResumeCraft found an unsupported or incomplete saved-resume schema.");
      return null;
    } catch (error) {
      console.error("ResumeCraft could not read saved resumes.", error);
      this.backupUnreadableLibrary(raw);
      return null;
    }
  }

  private backupUnreadableLibrary(raw: string) {
    try {
      this.storage.setItem(resumeLibraryRecoveryKey, raw);
    } catch {
      // Keep attempting a usable recovery even if a backup cannot be written.
    }
  }

  private readLegacyResume(): ResumeContent | null {
    const raw = this.safeGet(legacyBuilderStorageKey);
    if (!raw) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      return parseContent(parsed);
    } catch (error) {
      console.error("ResumeCraft could not migrate the legacy resume.", error);
      return null;
    }
  }

  private safeGet(key: string) {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      throw new ResumeStorageError("Browser storage is unavailable", { cause: error });
    }
  }

  private writeLibrary(library: ResumeLibrary) {
    const normalized = normalizeLibrary(library);
    if (!normalized) throw new ResumeStorageError("Refusing to save invalid resume data");
    try {
      this.storage.setItem(resumeLibraryStorageKey, JSON.stringify(normalized));
    } catch (error) {
      throw new ResumeStorageError("Could not save resumes in this browser", { cause: error });
    }
  }
}

export function exportResume(resume: SavedResume) {
  return JSON.stringify({ format: "resumecraft-resume", version: 1, name: resume.name, data: resume.data }, null, 2);
}

function normalizeLibrary(value: unknown): ResumeLibrary | null {
  if (!isRecord(value) || value.version !== resumeLibraryVersion || !Array.isArray(value.resumes)) return null;
  const ids = new Set<string>();
  const resumes = value.resumes.flatMap((item): SavedResume[] => {
    if (!isRecord(item) || typeof item.id !== "string" || ids.has(item.id)) return [];
    const data = parseContent(item.data);
    if (!data) return [];
    ids.add(item.id);
    const fallbackTime = new Date(0).toISOString();
    return [{
      id: item.id,
      name: cleanName(item.name, "Mi CV"),
      createdAt: validDate(item.createdAt) ?? fallbackTime,
      updatedAt: validDate(item.updatedAt) ?? validDate(item.createdAt) ?? fallbackTime,
      data,
    }];
  });
  if (!resumes.length) return null;
  const requestedActive = typeof value.activeResumeId === "string" ? value.activeResumeId : "";
  const activeResumeId = resumes.some((resume) => resume.id === requestedActive) ? requestedActive : resumes[0].id;
  return { version: resumeLibraryVersion, activeResumeId, resumes };
}

function parseImport(value: unknown) {
  if (isRecord(value) && value.format === "resumecraft-resume") return parseContent(value.data);
  return parseContent(value);
}

function importName(value: unknown) {
  return isRecord(value) && typeof value.name === "string" ? cleanName(value.name, "CV importado") : null;
}

function parseContent(value: unknown): ResumeContent | null {
  if (!isRecord(value) || !isResumeData(value.resume)) return null;
  const settings = isRecord(value.settings) ? value.settings : {};
  return { resume: clone(value.resume), settings: normalizeSettings(settings) };
}

function isResumeData(value: unknown): value is ResumeData {
  if (!isRecord(value) || !isRecord(value.contact) || !isRecord(value.sections)) return false;
  const contact = value.contact;
  const sections = value.sections;
  return [value.name, value.headline, value.summary].every(isString)
    && [contact.email, contact.phone, contact.location, contact.portfolio, contact.linkedIn, contact.github].every(isString)
    && Array.isArray(value.focus) && value.focus.every(isString)
    && Array.isArray(sections.experience) && sections.experience.every((item) => hasStrings(item, ["title", "organization", "period", "description"]))
    && Array.isArray(sections.projects) && sections.projects.every((item) => hasStrings(item, ["name", "description"]))
    && Array.isArray(sections.education) && sections.education.every((item) => hasStrings(item, ["degree", "institution", "period", "detail"]))
    && Array.isArray(sections.skills) && sections.skills.every(isString)
    && Array.isArray(sections.tools) && sections.tools.every(isString)
    && Array.isArray(sections.languages) && sections.languages.every((item) => hasStrings(item, ["name", "level"]));
}

function normalizeSettings(value: Record<string, unknown>): BuilderSettings {
  const defaults = defaultBuilderSettings;
  return {
    language: value.language === "en" ? "en" : "es",
    template: ["modern-sidebar", "professional-corporate", "minimal-clean", "creative-tech", "ats-clean"].includes(String(value.template)) ? value.template as BuilderSettings["template"] : defaults.template,
    typeScale: ["compact", "normal", "wide"].includes(String(value.typeScale)) ? value.typeScale as BuilderSettings["typeScale"] : defaults.typeScale,
    density: ["compact", "normal", "airy"].includes(String(value.density)) ? value.density as BuilderSettings["density"] : defaults.density,
    fontSize: ["small", "normal", "large"].includes(String(value.fontSize)) ? value.fontSize as BuilderSettings["fontSize"] : defaults.fontSize,
    fontScale: boundedNumber(value.fontScale, 80, 135, defaults.fontScale),
    lineHeightScale: boundedNumber(value.lineHeightScale, 90, 130, defaults.lineHeightScale),
    spacingScale: boundedNumber(value.spacingScale, 80, 140, defaults.spacingScale),
    showPhoto: typeof value.showPhoto === "boolean" ? value.showPhoto : defaults.showPhoto,
    showQr: typeof value.showQr === "boolean" ? value.showQr : defaults.showQr,
  };
}

function hasStrings(value: unknown, keys: string[]) {
  return isRecord(value) && keys.every((key) => isString(value[key]));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function validDate(value: unknown) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) return null;
  return new Date(value).toISOString();
}

function boundedNumber(value: unknown, min: number, max: number, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

function cleanName(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  return value.trim().slice(0, 120) || fallback;
}

function generateId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `resume-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
