import {
  Award, BookOpen, Bot, BriefcaseBusiness, Code2, FileBadge, GraduationCap,
  HeartHandshake, Info, Languages, Sparkles, Stethoscope, UserRound, Users, Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ResumeIconId } from "../data/resume";

export const resumeIconOptions: Array<{ id: ResumeIconId; label: string }> = [
  { id: "profile", label: "Profile" }, { id: "briefcase", label: "Business" },
  { id: "projects", label: "Projects" }, { id: "education", label: "Education" },
  { id: "skills", label: "Skills" }, { id: "tools", label: "Tools" },
  { id: "languages", label: "Languages" }, { id: "medical", label: "Medical" },
  { id: "certificate", label: "Certificate" }, { id: "book", label: "Publications" },
  { id: "users", label: "References" }, { id: "award", label: "Awards" },
  { id: "heart", label: "Volunteer" }, { id: "info", label: "Information" },
];

const icons: Record<ResumeIconId, LucideIcon> = {
  profile: Bot, briefcase: BriefcaseBusiness, projects: Code2, education: GraduationCap,
  skills: Sparkles, tools: Wrench, languages: Languages, medical: Stethoscope,
  certificate: FileBadge, book: BookOpen, users: Users, award: Award,
  heart: HeartHandshake, info: Info,
};

export function resumeIcon(id: ResumeIconId | undefined, fallback: LucideIcon = UserRound) {
  return id ? icons[id] : fallback;
}
