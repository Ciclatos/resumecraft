import {
  BarChart3,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Network,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { demoProfileData, profile } from "./profile";
import type { ResumeData, ResumeEntry, ResumeProject } from "./resume";

export type ResumeVariant = ResumeData & {
  slug: string;
  variantLabel: string;
  printMode: "balanced" | "compact" | "dense";
  metaDescription: string;
  showQr: boolean;
  icons: {
    summary: LucideIcon;
    experience: LucideIcon;
    projects: LucideIcon;
    education: LucideIcon;
  };
};

const operationsExperience: ResumeEntry[] = [
  {
    title: "Operations Analyst",
    organization: "Northstar Logistics",
    period: "2024 - Present",
    description:
      "Designed weekly performance reports, mapped recurring bottlenecks and coordinated process improvements across fulfillment and support teams.",
  },
  {
    title: "Customer Operations Coordinator",
    organization: "Brightlane Retail Group",
    period: "2022 - 2024",
    description:
      "Managed priority cases, documented service patterns and improved handoff quality between store, warehouse and customer support teams.",
  },
  {
    title: "Administrative Assistant",
    organization: "Atlas Financial Services",
    period: "2020 - 2022",
    description:
      "Prepared internal documentation, reconciled operational records and supported monthly reporting for administrative leadership.",
  },
];

const technologyExperience: ResumeEntry[] = [
  {
    title: "Frontend Developer",
    organization: "Luma Systems",
    period: "2024 - Present",
    description:
      "Built production React interfaces, improved reusable component patterns and collaborated with product teams on accessible workflows.",
  },
  {
    title: "Web Developer",
    organization: "Orbit Studio",
    period: "2022 - 2024",
    description:
      "Delivered responsive websites, documentation portals and internal tools with clean handoff practices and strong performance budgets.",
  },
  {
    title: "Technical Support Specialist",
    organization: "CloudBridge Services",
    period: "2020 - 2022",
    description:
      "Resolved technical incidents, documented recurring issues and translated customer feedback into product improvement notes.",
  },
];

const projects: ResumeProject[] = [
  {
    name: "Fulfillment KPI Dashboard",
    description:
      "Consolidated service-level indicators into a weekly dashboard used by operations managers.",
  },
  {
    name: "Returns Workflow Redesign",
    description:
      "Reduced duplicate manual checks by documenting a clearer intake and escalation process.",
  },
  {
    name: "Knowledge Base Refresh",
    description:
      "Updated internal procedures and templates to improve onboarding and reduce repeated questions.",
  },
];

const techProjects: ResumeProject[] = [
  {
    name: "Component Library",
    description:
      "Reusable UI primitives for forms, navigation, cards and data-heavy application screens.",
  },
  {
    name: "Release Notes Portal",
    description:
      "Static documentation site for product updates, changelogs and customer-facing guides.",
  },
  {
    name: "Support Insights",
    description:
      "Small dashboard prototype for categorizing customer issues and surfacing recurring patterns.",
  },
];

const commonOperationsData = {
  name: profile.name,
  photo: demoProfileData.photo,
  contact: demoProfileData.contact,
  headline: profile.headline,
  focus: [
    "Process improvement",
    "Reporting",
    "Operations planning",
    "Stakeholder coordination",
    "Data analysis",
    "Documentation",
  ],
  sections: {
    experience: operationsExperience,
    projects,
    education: profile.education,
    languages: demoProfileData.languages,
    skills: [
      "Operations reporting",
      "Process mapping",
      "Executive summaries",
      "Cross-functional coordination",
      "Customer experience",
      "Data quality review",
    ],
    tools: [
      "Excel",
      "Google Sheets",
      "Power BI",
      "Notion",
      "Airtable",
      "Slack",
      "Jira",
      "SQL basics",
    ],
  },
};

export const variants: Record<string, ResumeVariant> = {
  base: {
    slug: "base",
    variantLabel: "General Demo",
    printMode: "balanced",
    metaDescription:
      "Fictional ResumeCraft demo showing a professional operations resume with structured data and PDF export.",
    showQr: true,
    ...commonOperationsData,
    summary:
      "Operations analyst with experience improving workflows, preparing executive reports and coordinating cross-functional initiatives. Combines structured problem solving, data analysis and clear communication to help teams make faster decisions.",
    icons: {
      summary: LayoutDashboard,
      experience: BriefcaseBusiness,
      projects: BarChart3,
      education: GraduationCap,
    },
  },
  edteam: {
    slug: "edteam",
    variantLabel: "Technology Demo",
    name: "Mateo Cruz",
    photo: "",
    contact: {
      email: "mateo.cruz@example.com",
      phone: "+1 555 0128",
      location: "Remote / Bogotá",
      portfolio: "https://mateo.example.com",
      linkedIn: "https://www.linkedin.com/in/mateo-cruz/",
      github: "https://github.com/mateo-cruz",
    },
    printMode: "compact",
    metaDescription:
      "Fictional ResumeCraft technology demo for a frontend developer profile.",
    headline: "Frontend Developer | React | Product Engineering",
    summary:
      "Frontend developer focused on building accessible, maintainable web products with React, TypeScript and thoughtful user experiences. Comfortable translating product goals into clean interfaces and production-ready delivery.",
    focus: [
      "React",
      "TypeScript",
      "Design systems",
      "Accessibility",
      "Performance",
      "Product thinking",
    ],
    showQr: true,
    sections: {
      experience: technologyExperience,
      projects: techProjects,
      education: [
        {
          degree: "B.S. Computer Science",
          institution: "Open Technology University",
          period: "2018 - 2022",
          detail:
            "Coursework in software engineering, databases, human-computer interaction and web systems.",
        },
      ],
      languages: [
        { name: "Spanish", level: "Native" },
        { name: "English", level: "Professional" },
      ],
      skills: [
        "Reusable UI architecture",
        "Responsive layout",
        "Accessibility",
        "API integration",
        "Technical documentation",
        "Design collaboration",
      ],
      tools: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Git",
        "Figma",
        "Vercel",
        "Playwright",
      ],
    },
    icons: {
      summary: Sparkles,
      experience: BriefcaseBusiness,
      projects: Code2,
      education: GraduationCap,
    },
  },
  walmart: {
    slug: "walmart",
    variantLabel: "Corporate Demo",
    printMode: "dense",
    metaDescription:
      "Fictional ResumeCraft corporate demo for operations, administration and retail roles.",
    showQr: false,
    ...commonOperationsData,
    headline:
      "Operations Coordination | Retail Analytics | Administrative Reporting",
    summary:
      "Corporate operations profile with experience in service coordination, reporting, documentation and process follow-up. Strong fit for structured environments that require clarity, reliability and measurable execution.",
    sections: {
      ...commonOperationsData.sections,
      additional:
        "Open to hybrid operations, retail administration and business reporting roles. Comfortable coordinating with internal teams and maintaining accurate records.",
    },
    icons: {
      summary: Network,
      experience: BriefcaseBusiness,
      projects: LineChart,
      education: GraduationCap,
    },
  },
};
