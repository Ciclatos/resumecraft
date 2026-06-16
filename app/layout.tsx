import type { Metadata } from "next";
import "./globals.css";
import "../styles/print.css";

export const metadata: Metadata = {
  title: "ResumeCraft",
  description:
    "Herramienta open source para crear CVs profesionales, editables y exportables a PDF desde el navegador.",
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
