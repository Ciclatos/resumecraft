export const profile = {
  name: "Sofía Herrera",
  photo: "",
  email: "sofia.herrera@example.com",
  phone: "+1 555 0184",
  location: "Remote / Ciudad de México",
  linkedIn: "https://www.linkedin.com/in/sofia-herrera/",
  github: "https://github.com/sofia-herrera",
  portfolio: "https://portfolio.example.com",
  headline:
    "Operations Analyst | Process Improvement | Data Reporting",
  education: [
    {
      degree: "B.B.A. Operations Management",
      institution: "Metropolitan Business School",
      period: "2019 - 2023",
      detail: "Coursework in process management, business analytics, supply chain planning and finance.",
    },
    {
      degree: "Certificate in Business Analytics",
      institution: "Civic Data Institute",
      period: "2024",
      detail: "Focused training in dashboards, stakeholder reporting and operational metrics.",
    },
  ],
  languages: [
    { name: "Spanish", level: "Native" },
    { name: "English", level: "Professional" },
  ],
};

export type Profile = typeof profile;

export const demoProfileData = {
  name: profile.name,
  photo: profile.photo,
  contact: {
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    portfolio: profile.portfolio,
    linkedIn: profile.linkedIn,
    github: profile.github,
  },
  languages: profile.languages,
};
