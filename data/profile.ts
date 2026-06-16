export const profile = {
  name: "Carlos Díaz",
  photo: "/foto.png",
  email: "carloseduardo151211@gmail.com",
  phone: "+502 5683-8132",
  location: "Guatemala, Amatitlán",
  linkedIn: "https://www.linkedin.com/in/carlos-diaz-00a014303/",
  github: "https://github.com/Ciclatos",
  portfolio: "https://carlos-diaz-portfolio.vercel.app",
  headline:
    "IA y Automatización | Desarrollo Web | Producción de Contenidos Digitales",
  education: [
    {
      degree: "Ingeniería en Sistemas e Informática",
      institution: "Universidad Mariano Gálvez",
      period: "2025 - Actualidad",
      detail: "Estudios universitarios iniciados en tecnología, sistemas y análisis de información.",
    },
    {
      degree:
        "Licenciatura en Producción de Audio y Música Digital con énfasis en Music Business",
      institution: "Universidad Panamericana",
      period: "2020 - 2025",
      detail: "Formación en producción digital, gestión de proyectos creativos y comunicación.",
    },
    {
      degree: "Bachillerato en Ciencias y Letras con Orientación en Computación",
      institution: "Colegio Internacionales",
      period: "2018 - 2019",
      detail: "Base académica en computación, documentación y herramientas digitales.",
    },
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Nivel alto" },
  ],
};

export type Profile = typeof profile;
