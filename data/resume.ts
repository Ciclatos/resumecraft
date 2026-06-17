export type ResumeEntry = {
  title: string;
  organization: string;
  period: string;
  description: string;
};

export type ResumeEducation = {
  degree: string;
  institution: string;
  period: string;
  detail: string;
};

export type ResumeProject = {
  name: string;
  description: string;
};

export type ResumeLanguage = {
  name: string;
  level: string;
};

export type ResumeContact = {
  email: string;
  phone: string;
  location: string;
  portfolio: string;
  linkedIn: string;
  github: string;
};

export type ResumeTemplate =
  | "modern-sidebar"
  | "professional-corporate"
  | "minimal-clean"
  | "creative-tech"
  | "ats-clean";

export type TypeScale = "compact" | "normal" | "wide";

export type ResumeDensity = "compact" | "normal" | "airy";

export type FontSize = "small" | "normal" | "large";

export type BuilderSettings = {
  template: ResumeTemplate;
  typeScale: TypeScale;
  density: ResumeDensity;
  fontSize: FontSize;
  fontScale: number;
  lineHeightScale: number;
  spacingScale: number;
  showPhoto: boolean;
  showQr: boolean;
};

export type ResumeData = {
  name: string;
  photo?: string;
  headline: string;
  contact: ResumeContact;
  summary: string;
  focus: string[];
  sections: {
    experience: ResumeEntry[];
    projects: ResumeProject[];
    education: ResumeEducation[];
    skills: string[];
    tools: string[];
    languages: ResumeLanguage[];
    additional?: string;
  };
};

export const exampleResumeData: ResumeData = {
  name: "Sofía Herrera",
  photo: "/avatar.svg",
  headline: "Operations Analyst | Process Improvement | Data Reporting",
  contact: {
    email: "sofia.herrera@example.com",
    phone: "+1 555 0184",
    location: "Remote / Ciudad de México",
    portfolio: "https://portfolio.example.com",
    linkedIn: "https://www.linkedin.com/in/sofia-herrera/",
    github: "https://github.com/sofia-herrera",
  },
  summary:
    "Operations analyst with experience improving workflows, preparing executive reports and coordinating cross-functional initiatives. Combines structured problem solving, data analysis and clear communication to help teams make faster decisions.",
  focus: [
    "Process improvement",
    "Reporting",
    "Stakeholder coordination",
    "Operations planning",
    "Data analysis",
    "Documentation",
  ],
  sections: {
    experience: [
      {
        title: "Operations Analyst",
        organization: "Northstar Logistics",
        period: "2024 - Present",
        description:
          "Designed weekly performance reports, mapped recurring operational bottlenecks and coordinated process improvements across fulfillment and support teams.",
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
    ],
    projects: [
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
    ],
    education: [
      {
        degree: "B.B.A. Operations Management",
        institution: "Metropolitan Business School",
        period: "2019 - 2023",
        detail:
          "Coursework in process management, business analytics, supply chain planning and finance.",
      },
    ],
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
    languages: [
      { name: "English", level: "Professional" },
      { name: "Spanish", level: "Native" },
    ],
  },
};

export const defaultBuilderSettings: BuilderSettings = {
  template: "modern-sidebar",
  typeScale: "normal",
  density: "normal",
  fontSize: "normal",
  fontScale: 100,
  lineHeightScale: 100,
  spacingScale: 100,
  showPhoto: true,
  showQr: true,
};
