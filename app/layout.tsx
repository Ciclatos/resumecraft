import type { Metadata } from "next";
import "./globals.css";
import "../styles/print.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://resumecraft-ciclatos.vercel.app"),
  title: {
    default: "ResumeCraft | Open Source CV Builder",
    template: "%s | ResumeCraft",
  },
  description:
    "Create professional resumes in the browser with editable templates, local storage and clean PDF export. No login required.",
  applicationName: "ResumeCraft",
  keywords: [
    "resume builder",
    "CV builder",
    "open source resume",
    "PDF resume",
    "editable CV",
  ],
  authors: [{ name: "ResumeCraft" }],
  creator: "ResumeCraft",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "ResumeCraft | Open Source CV Builder",
    description:
      "Create professional resumes with editable templates, local browser storage and PDF export.",
    url: "https://resumecraft-ciclatos.vercel.app",
    siteName: "ResumeCraft",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ResumeCraft | Open Source CV Builder",
    description:
      "Create professional resumes with editable templates, local browser storage and PDF export.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
