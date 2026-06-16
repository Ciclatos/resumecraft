import {
  Bot,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Newspaper,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { profile } from "./profile";

export type ResumeEntry = {
  title: string;
  organization: string;
  period: string;
  description: string;
};

export type ResumeProject = {
  name: string;
  description: string;
};

export type ResumeVariant = {
  slug: string;
  name: string;
  printMode: "balanced" | "compact" | "dense";
  metaDescription: string;
  headline: string;
  summary: string;
  focus: string[];
  showQr: boolean;
  sections: {
    experience: ResumeEntry[];
    projects: ResumeProject[];
    education: typeof profile.education;
    skills: string[];
    tools: string[];
    additional?: string;
  };
  icons: {
    summary: LucideIcon;
    experience: LucideIcon;
    projects: LucideIcon;
    education: LucideIcon;
  };
};

const baseExperience: ResumeEntry[] = [
  {
    title: "Productor de audio",
    organization: "Agencia Ocote",
    period: "2024 - 2026",
    description:
      "Producción, edición y postproducción de audio para proyectos periodísticos y de comunicación digital, con atención al detalle, planificación y coordinación de entregables.",
  },
  {
    title: "Soporte técnico y atención al cliente",
    organization: "TELUS - Google Fi",
    period: "2024",
    description:
      "Resolución de incidencias, atención al cliente, configuración de sistemas, documentación de casos y seguimiento ordenado de solicitudes.",
  },
  {
    title: "Productor de audio",
    organization: "FeatMia",
    period: "2022",
    description:
      "Producción de audio para campañas publicitarias y colaboración con equipos de marketing para convertir objetivos de comunicación en piezas claras.",
  },
  {
    title: "Prácticas técnicas",
    organization: "Hospittalia",
    period: "2019",
    description:
      "Prácticas supervisadas en entorno técnico, con apoyo en actividades operativas, documentación y seguimiento de procesos.",
  },
];

const projects: ResumeProject[] = [
  {
    name: "PhyLab",
    description:
      "Plataforma educativa interactiva para Física I con simuladores, gráficas dinámicas y tutor IA contextual.",
  },
  {
    name: "MedSync",
    description:
      "Sistema hospitalario privado en desarrollo para gestión de pacientes, cirugías, finanzas, inventario y cuentas por cobrar.",
  },
  {
    name: "Project Pulse",
    description:
      "Herramienta para crear y manipular música mediante código, conectando producción digital con pensamiento técnico.",
  },
  {
    name: "Amaranto Parfum",
    description:
      "Prototipo de personalización de perfumes apoyado por IA y automatización para mejorar la experiencia de usuario.",
  },
];

export const variants: Record<string, ResumeVariant> = {
  base: {
    slug: "base",
    name: "CV General",
    printMode: "balanced",
    metaDescription:
      "Perfil general de Carlos Díaz en tecnología, IA, automatización, desarrollo web y contenidos digitales.",
    headline: profile.headline,
    summary:
      "Licenciado en Producción de Audio y Música Digital con énfasis en Music Business y estudiante de Ingeniería en Sistemas. Experiencia en tecnología, automatización, desarrollo web, producción de contenidos digitales, atención al cliente, análisis de información, documentación y proyectos con IA.",
    focus: [
      "IA aplicada",
      "Automatización",
      "Desarrollo web",
      "Contenido digital",
      "Documentación",
      "Atención al cliente",
    ],
    showQr: true,
    sections: {
      experience: baseExperience,
      projects,
      education: profile.education,
      skills: [
        "Automatización de procesos",
        "Desarrollo web con React",
        "Análisis y documentación",
        "Producción de contenidos digitales",
        "Atención al cliente",
        "Investigación con IA",
        "Comunicación clara",
        "Aprendizaje continuo",
      ],
      tools: [
        "ChatGPT",
        "Claude",
        "Codex",
        "Kimi",
        "n8n",
        "JavaScript",
        "React",
        "Node.js",
        "Git",
        "PostgreSQL",
      ],
    },
    icons: {
      summary: Bot,
      experience: BriefcaseBusiness,
      projects: Code2,
      education: GraduationCap,
    },
  },
  edteam: {
    slug: "edteam",
    name: "CV EDteam",
    printMode: "compact",
    metaDescription:
      "CV de Carlos Díaz adaptado a Asistente de Contenidos en EDteam.",
    headline:
      "Tecnología, IA y Comunicación | Producción de Contenidos Digitales",
    summary:
      "Perfil híbrido entre tecnología, inteligencia artificial y comunicación. Formación en producción digital y estudios actuales de Ingeniería en Sistemas, con experiencia investigando, sintetizando información, documentando procesos y creando contenidos para entornos digitales. Interés fuerte en aprendizaje continuo, educación tecnológica y uso responsable de IA para apoyar equipos de contenido.",
    focus: [
      "Investigación",
      "Síntesis",
      "IA",
      "Contenido digital",
      "Documentación",
      "Comunicación",
    ],
    showQr: true,
    sections: {
      experience: [
        {
          ...baseExperience[0],
          description:
            "Producción y postproducción de contenidos de audio para proyectos periodísticos, cuidando claridad narrativa, estructura, calidad técnica y comunicación con equipos editoriales.",
        },
        {
          ...baseExperience[1],
          description:
            "Atención a usuarios, documentación de casos, diagnóstico de incidencias y explicación clara de soluciones técnicas en un entorno de alto volumen.",
        },
        {
          ...baseExperience[2],
          description:
            "Producción de piezas para campañas publicitarias, alineando contenido, audiencia y objetivos de marca junto a equipos de marketing.",
        },
        baseExperience[3],
      ],
      projects,
      education: profile.education,
      skills: [
        "Investigación y curación de información",
        "Síntesis de temas técnicos",
        "Redacción y documentación",
        "Producción de contenidos digitales",
        "Uso de IA para productividad",
        "Comunicación con equipos",
        "Organización de entregables",
        "Aprendizaje continuo",
      ],
      tools: [
        "ChatGPT",
        "Claude",
        "Codex",
        "Kimi",
        "Google Sheets",
        "PowerPoint",
        "React",
        "JavaScript",
        "n8n",
        "Documentación",
      ],
    },
    icons: {
      summary: Newspaper,
      experience: BriefcaseBusiness,
      projects: Workflow,
      education: GraduationCap,
    },
  },
  walmart: {
    slug: "walmart",
    name: "CV Walmart",
    printMode: "dense",
    metaDescription:
      "CV de Carlos Díaz adaptado a Programador de Pedidos en Walmart.",
    headline:
      "Análisis de Datos | Reportes | Servicio al Cliente | Organización Operativa",
    summary:
      "Estudiante de Ingeniería en Sistemas con experiencia en servicio al cliente, soporte técnico, documentación y seguimiento de solicitudes. Perfil ordenado y analítico, con manejo de actividades simultáneas, Excel intermedio, elaboración de reportes y comunicación efectiva. IA y automatización como apoyo para productividad, análisis y organización.",
    focus: [
      "Excel intermedio",
      "Análisis de datos",
      "Reportes",
      "Seguimiento",
      "Servicio al cliente",
      "Planificación",
    ],
    showQr: false,
    sections: {
      experience: [
        {
          ...baseExperience[1],
          description:
            "Atención a clientes, resolución de solicitudes, documentación de casos y seguimiento de incidencias con orden y calidad.",
        },
        {
          ...baseExperience[0],
          description:
            "Planificación de entregables, organización de archivos, coordinación con equipos y cumplimiento de procesos.",
        },
        {
          ...baseExperience[2],
          description:
            "Atención a requerimientos, orden de materiales y apoyo en entregables para campañas.",
        },
        baseExperience[3],
      ],
      projects: [
        {
          name: "MedSync",
          description:
            "Sistema hospitalario con módulos de pacientes, finanzas, inventario y cuentas por cobrar.",
        },
        {
          name: "PhyLab",
          description:
            "Plataforma educativa con visualización de datos, simuladores y reportes de aprendizaje.",
        },
        {
          name: "Amaranto Parfum",
          description:
            "Prototipo con automatización para ordenar preferencias de clientes.",
        },
        {
          name: "Project Pulse",
          description:
            "Herramienta para estructurar procesos y manipular información digital.",
        },
      ],
      education: profile.education,
      skills: [
        "Análisis de datos",
        "Excel intermedio",
        "Elaboración de reportes",
        "Seguimiento de solicitudes",
        "Atención a clientes internos y externos",
        "Manejo de múltiples actividades",
        "Planificación y orden",
        "Comunicación efectiva",
        "Iniciativa y mejora continua",
      ],
      tools: [
        "Excel intermedio",
        "Google Sheets",
        "PowerPoint",
        "Reportes",
        "Diagnósticos",
        "Conclusiones",
        "Documentación técnica",
        "ChatGPT",
        "Automatización",
        "APIs",
      ],
      additional:
        "Disponibilidad compatible con CD Bárcenas: lunes 4:00 am a 2:00 pm; martes a viernes 6:00 am a 1:00 pm; sábado 7:00 am a 11:00 am. Disposición presencial y coordinación con áreas internas.",
    },
    icons: {
      summary: LayoutDashboard,
      experience: BriefcaseBusiness,
      projects: LineChart,
      education: GraduationCap,
    },
  },
};
