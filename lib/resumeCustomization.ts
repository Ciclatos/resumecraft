import type { AppLanguage, TranslationKey } from "../data/i18n";
import { t } from "../data/i18n";
import type { BuiltInSectionId, ExtraResumeSection, ExtraSectionPreset, ResumeData, ResumeIconId, ResumeSectionPreference } from "../data/resume";

export const builtInSectionIds: BuiltInSectionId[] = [
  "summary", "experience", "projects", "education", "skills", "tools", "languages",
];

export const mainSectionIds: BuiltInSectionId[] = ["experience", "projects", "education"];
export const listSectionIds: BuiltInSectionId[] = ["skills", "tools", "languages"];

const labelKeys: Record<BuiltInSectionId, TranslationKey> = {
  summary: "section.profile",
  experience: "section.experienceLong",
  projects: "section.projectsLong",
  education: "section.education",
  skills: "section.skills",
  tools: "section.tools",
  languages: "section.languages",
};

export const defaultSectionIcons: Record<BuiltInSectionId, ResumeIconId> = {
  summary: "profile",
  experience: "briefcase",
  projects: "projects",
  education: "education",
  skills: "skills",
  tools: "tools",
  languages: "languages",
};

export function resolveSectionPreferences(data: ResumeData): ResumeSectionPreference[] {
  const configured = new Map((data.sectionPreferences ?? []).map((item) => [item.id, item]));
  const requestedOrder = (data.sectionPreferences ?? []).map((item) => item.id);
  const order = [...requestedOrder, ...builtInSectionIds.filter((id) => !requestedOrder.includes(id))];
  return order.map((id) => ({ id, enabled: true, ...configured.get(id) }));
}

export function sectionTitle(data: ResumeData, id: BuiltInSectionId, language: AppLanguage) {
  const override = data.sectionPreferences?.find((item) => item.id === id)?.title?.trim();
  return override || t(language, labelKeys[id]);
}

export function sectionEnabled(data: ResumeData, id: BuiltInSectionId) {
  return data.sectionPreferences?.find((item) => item.id === id)?.enabled ?? true;
}

export function contactEnabled(data: ResumeData, id: keyof NonNullable<ResumeData["contact"]["visibility"]>) {
  return data.contact.visibility?.[id] ?? true;
}

const extraLabelKeys: Record<ExtraSectionPreset, TranslationKey> = {
  certifications: "section.certifications", courses: "section.courses", memberships: "section.memberships",
  publications: "section.publications", awards: "section.awards", volunteer: "section.volunteer",
  references: "section.references", additional: "section.additional", custom: "section.custom",
};

export function extraSectionTitle(section: ExtraResumeSection, language: AppLanguage) {
  return section.title.trim() || (section.preset ? t(language, extraLabelKeys[section.preset]) : t(language, "section.custom"));
}
