import type { Metadata } from "next";
import { ResumeBuilder } from "../../components/ResumeBuilder";

export const metadata: Metadata = {
  title: "Builder | ResumeCraft",
  description:
    "Crea un CV editable, guárdalo en el navegador y expórtalo a PDF con ResumeCraft.",
};

export default function BuilderPage() {
  return <ResumeBuilder />;
}
