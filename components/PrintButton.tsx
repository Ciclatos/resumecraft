"use client";

import { Download } from "lucide-react";

export function PrintButton() {
  return (
    <button className="print-button" type="button" onClick={() => window.print()}>
      <Download size={16} aria-hidden="true" />
      Descargar PDF
    </button>
  );
}
