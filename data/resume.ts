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
  name: "Alex Rivera",
  photo: "",
  headline: "Frontend Developer | React | UX Engineering",
  contact: {
    email: "alex.rivera@example.com",
    phone: "+1 555 0199",
    location: "Remote / Guatemala",
    portfolio: "https://example.com",
    linkedIn: "https://www.linkedin.com/in/alex-rivera/",
    github: "https://github.com/alexrivera",
  },
  summary:
    "Frontend developer focused on building accessible, maintainable web products with React, TypeScript and thoughtful user experiences. Comfortable translating product goals into clean interfaces, reusable components and production-ready delivery.",
  focus: [
    "React",
    "TypeScript",
    "Design systems",
    "Accessibility",
    "Performance",
    "Product thinking",
  ],
  sections: {
    experience: [
      {
        title: "Frontend Developer",
        organization: "Northstar Studio",
        period: "2024 - Present",
        description:
          "Built reusable React components, improved dashboard workflows and collaborated with product teams to ship responsive interfaces.",
      },
      {
        title: "Web Developer",
        organization: "Freelance",
        period: "2022 - 2024",
        description:
          "Delivered landing pages, admin tools and portfolio sites with strong attention to content structure, performance and handoff quality.",
      },
    ],
    projects: [
      {
        name: "LaunchBoard",
        description:
          "Internal planning dashboard with project milestones, filters and status summaries for small teams.",
      },
      {
        name: "PatternKit",
        description:
          "Reusable component library documenting forms, cards, navigation and responsive layout patterns.",
      },
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "Open University",
        period: "2019 - 2023",
        detail:
          "Coursework in software engineering, databases, human-computer interaction and web systems.",
      },
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
    languages: [
      { name: "English", level: "Professional" },
      { name: "Spanish", level: "Conversational" },
    ],
  },
};
