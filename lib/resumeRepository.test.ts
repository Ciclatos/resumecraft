import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultBuilderSettings, exampleResumeData } from "../data/resume";
import {
  legacyBuilderStorageKey,
  resumeLibraryRecoveryKey,
  resumeLibraryStorageKey,
  ResumeRepository,
  resumeLibraryVersion,
  exportResume,
  type StorageLike,
} from "./resumeRepository";

class MemoryStorage implements StorageLike {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe("ResumeRepository", () => {
  let storage: MemoryStorage;
  let nextId: number;
  let repository: ResumeRepository;
  const content = { resume: exampleResumeData, settings: defaultBuilderSettings };

  beforeEach(() => {
    storage = new MemoryStorage();
    nextId = 1;
    repository = new ResumeRepository(
      storage,
      () => new Date(`2026-08-24T00:00:0${nextId}.000Z`),
      () => `resume-${nextId++}`,
    );
  });

  it("creates a usable first resume and tracks the active resume", () => {
    const library = repository.getLibrary();
    expect(library.version).toBe(resumeLibraryVersion);
    expect(library.resumes).toHaveLength(1);
    expect(library.activeResumeId).toBe(library.resumes[0].id);
  });

  it("creates, updates, renames, switches, duplicates deeply, and deletes resumes", () => {
    repository.getLibrary();
    const created = repository.createResume("Frontend", content);
    expect(repository.getActiveResumeId()).toBe(created.id);

    const updatedData = structuredClone(content);
    updatedData.resume.summary = "Tailored summary";
    repository.updateResume(created.id, updatedData);
    expect(repository.getResumeById(created.id)?.data.resume.summary).toBe("Tailored summary");

    repository.renameResume(created.id, "Frontend - Español");
    const duplicate = repository.duplicateResume(created.id);
    expect(duplicate.name).toBe("Frontend - Español - Copia");
    expect(duplicate.id).not.toBe(created.id);
    duplicate.data.resume.summary = "mutated outside repository";
    expect(repository.getResumeById(created.id)?.data.resume.summary).toBe("Tailored summary");

    repository.setActiveResume(created.id);
    const afterDelete = repository.deleteResume(created.id);
    expect(afterDelete.activeResumeId).not.toBe(created.id);
    expect(afterDelete.resumes.some((item) => item.id === created.id)).toBe(false);
  });

  it("deleting the last resume creates a blank active replacement", () => {
    const initial = repository.getLibrary();
    const next = repository.deleteResume(initial.activeResumeId);
    expect(next.resumes).toHaveLength(1);
    expect(next.resumes[0].data.resume.name).toBe("");
    expect(next.activeResumeId).toBe(next.resumes[0].id);
  });

  it("migrates the real legacy format without deleting it and only migrates once", () => {
    storage.setItem(legacyBuilderStorageKey, JSON.stringify(content));
    const first = repository.getLibrary();
    expect(first.resumes[0].data).toEqual(content);
    expect(first.resumes[0].name).toBe("Mi CV");
    expect(storage.getItem(legacyBuilderStorageKey)).not.toBeNull();

    storage.setItem(legacyBuilderStorageKey, JSON.stringify({ ...content, resume: { ...exampleResumeData, name: "Changed legacy" } }));
    const reloaded = new ResumeRepository(storage, () => new Date(), () => "unused").getLibrary();
    expect(reloaded.resumes[0].data.resume.name).toBe(exampleResumeData.name);
  });

  it("recovers safely from corrupt legacy data", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    storage.setItem(legacyBuilderStorageKey, "not-json");
    expect(repository.getLibrary().resumes[0].data.resume.name).toBe("");
    expect(storage.getItem(legacyBuilderStorageKey)).toBe("not-json");
    consoleSpy.mockRestore();
  });

  it("backs up a corrupt current schema before recovering", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    storage.setItem(resumeLibraryStorageKey, "{broken");
    repository.getLibrary();
    expect(storage.getItem(resumeLibraryRecoveryKey)).toBe("{broken");
    consoleSpy.mockRestore();
  });

  it("backs up an unsupported current schema before recovering", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const unsupported = JSON.stringify({ version: 99, activeResumeId: "future", resumes: [] });
    storage.setItem(resumeLibraryStorageKey, unsupported);
    repository.getLibrary();
    expect(storage.getItem(resumeLibraryRecoveryKey)).toBe(unsupported);
    consoleSpy.mockRestore();
  });

  it("repairs a missing active resume and ignores duplicate IDs", () => {
    repository.getLibrary();
    const first = repository.getAllResumes()[0];
    storage.setItem(resumeLibraryStorageKey, JSON.stringify({
      version: resumeLibraryVersion,
      activeResumeId: "missing",
      resumes: [first, { ...first, name: "Duplicate" }],
    }));
    const repaired = repository.getLibrary();
    expect(repaired.resumes).toHaveLength(1);
    expect(repaired.activeResumeId).toBe(first.id);
  });

  it("validates imports and always assigns a new internal ID", () => {
    repository.getLibrary();
    const imported = repository.importResume({ format: "resumecraft-resume", version: 1, name: "Imported", data: content });
    expect(imported.name).toBe("Imported");
    expect(imported.id).not.toBe(repository.getAllResumes()[0].id);
    expect(() => repository.importResume({ nope: true })).toThrow("Invalid ResumeCraft resume file");
  });

  it("imports version 1 unchanged and round-trips modular version 2 fields", () => {
    repository.getLibrary();
    const legacy = repository.importResume({ format: "resumecraft-resume", version: 1, name: "Legacy", data: content });
    expect(legacy.data.resume.sectionPreferences).toBeUndefined();
    expect(legacy.data.resume.contact.visibility).toBeUndefined();

    const modular = structuredClone(content);
    modular.resume.sectionPreferences = [
      { id: "summary", enabled: true }, { id: "experience", enabled: true, title: "Experiencia Clínica", icon: "medical" },
      { id: "projects", enabled: false }, { id: "education", enabled: true }, { id: "skills", enabled: true },
      { id: "tools", enabled: false }, { id: "languages", enabled: true },
    ];
    modular.resume.contact.visibility = { github: false, portfolio: false };
    modular.resume.contact.custom = [{ id: "license", label: "Colegiado", value: "12345", icon: "certificate", enabled: true }];
    modular.resume.extraSections = [{ id: "certifications", kind: "entries", enabled: true, title: "Certificaciones", icon: "certificate", entries: [{ title: "Anestesiología", subtitle: "Consejo Médico", period: "2026", description: "Vigente" }] }];
    const saved = repository.createResume("Medical", modular);
    const exported = JSON.parse(exportResume(saved));
    expect(exported.version).toBe(2);
    const imported = repository.importResume(exported);
    expect(imported.data).toEqual(modular);
  });

  it("recovers data saved by the reverted experimental modular build", () => {
    repository.getLibrary();
    const experimental = structuredClone(content) as typeof content & { resume: typeof content.resume & Record<string, unknown> };
    experimental.resume.sectionConfig = [
      { id: "summary", kind: "summary", title: "Professional Summary", icon: "user", enabled: true },
      { id: "experience", kind: "experience", title: "Experiencia Clínica", icon: "stethoscope", enabled: true },
      { id: "projects", kind: "projects", title: "Projects", icon: "folder", enabled: false },
    ];
    experimental.resume.contact = { ...experimental.resume.contact, items: [{ id: "license", label: "License", value: "MED-1", icon: "certificate", enabled: true }] } as typeof experimental.resume.contact;
    (experimental.resume as Record<string, unknown>).extraSections = [{ id: "cert", kind: "credentials", title: "Certificaciones", icon: "certificate", enabled: true, items: [{ title: "Board", subtitle: "College", period: "2026", description: "Active" }] }];
    const imported = repository.importResume({ format: "resumecraft-resume", version: 2, data: experimental });
    expect(imported.data.resume.sectionPreferences?.find((item) => item.id === "summary")?.title).toBeUndefined();
    expect(imported.data.resume.sectionPreferences?.find((item) => item.id === "experience")?.title).toBe("Experiencia Clínica");
    expect(imported.data.resume.contact.custom?.[0].value).toBe("MED-1");
    expect(imported.data.resume.extraSections?.[0].kind).toBe("entries");
  });

  it("surfaces browser quota/storage failures", () => {
    const brokenStorage: StorageLike = {
      getItem: () => null,
      setItem: () => { throw new DOMException("Quota exceeded", "QuotaExceededError"); },
    };
    expect(() => new ResumeRepository(brokenStorage).getLibrary()).toThrow("Could not save resumes");
  });
});
