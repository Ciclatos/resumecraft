import type { Metadata } from "next";
import "./globals.css";
import "../styles/print.css";

export const metadata: Metadata = {
  title: "Carlos CV Builder",
  description: "CVs profesionales de Carlos Díaz, editables y exportables a PDF.",
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
