"use client";

import { Download } from "lucide-react";
import { t, type AppLanguage } from "../data/i18n";

export function PrintButton({ language = "es" }: { language?: AppLanguage }) {
  return (
    <button className="print-button" type="button" onClick={() => window.print()}>
      <Download size={16} aria-hidden="true" />
      {t(language, "print.button")}
    </button>
  );
}
