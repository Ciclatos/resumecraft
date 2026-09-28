import { describe, expect, it } from "vitest";
import { exampleResumeData } from "../data/resume";
import { contactEnabled, extraSectionTitle, resolveSectionPreferences, sectionEnabled, sectionTitle } from "./resumeCustomization";

describe("resume customization", () => {
  it("localizes default built-in titles without storing translated identity", () => {
    expect(sectionTitle(exampleResumeData, "experience", "es")).toBe("Experiencia laboral");
    expect(sectionTitle(exampleResumeData, "experience", "en")).toBe("Work experience");
    expect(sectionTitle(exampleResumeData, "skills", "es")).toBe("Habilidades");
    expect(sectionTitle(exampleResumeData, "skills", "en")).toBe("Skills");
  });

  it("keeps explicit titles unchanged across language switches", () => {
    const data = { ...exampleResumeData, sectionPreferences: [{ id: "experience" as const, enabled: true, title: "Experiencia Clínica" }] };
    expect(sectionTitle(data, "experience", "es")).toBe("Experiencia Clínica");
    expect(sectionTitle(data, "experience", "en")).toBe("Experiencia Clínica");
    expect(sectionTitle(data, "experience", "es")).toBe("Experiencia Clínica");
  });

  it("localizes optional presets while preserving explicit overrides", () => {
    const section = { id: "certifications", kind: "entries" as const, preset: "certifications" as const, enabled: true, title: "", icon: "certificate" as const, entries: [] };
    expect(extraSectionTitle(section, "es")).toBe("Certificaciones");
    expect(extraSectionTitle(section, "en")).toBe("Certifications");
    expect(extraSectionTitle({ ...section, title: "Certificaciones Médicas" }, "en")).toBe("Certificaciones Médicas");
  });

  it("defaults old resumes to the original visible order and supports overrides", () => {
    expect(resolveSectionPreferences(exampleResumeData).map((item) => item.id)).toEqual(["summary", "experience", "projects", "education", "skills", "tools", "languages"]);
    expect(sectionEnabled(exampleResumeData, "projects")).toBe(true);
    const configured = { ...exampleResumeData, sectionPreferences: [{ id: "projects" as const, enabled: false }, { id: "experience" as const, enabled: true }] };
    expect(resolveSectionPreferences(configured).slice(0, 2).map((item) => item.id)).toEqual(["projects", "experience"]);
    expect(sectionEnabled(configured, "projects")).toBe(false);
  });

  it("defaults legacy contacts to visible and respects explicit visibility", () => {
    expect(contactEnabled(exampleResumeData, "github")).toBe(true);
    expect(contactEnabled({ ...exampleResumeData, contact: { ...exampleResumeData.contact, visibility: { github: false } } }, "github")).toBe(false);
  });
});
