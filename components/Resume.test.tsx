import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { exampleResumeData } from "../data/resume";
import { Resume } from "./Resume";

function render(overrides: Partial<React.ComponentProps<typeof Resume>> = {}) {
  return renderToStaticMarkup(React.createElement(Resume, {
    data: exampleResumeData,
    label: "Modern Sidebar",
    showDemoLinks: false,
    ...overrides,
  }));
}

describe("Resume rendering regressions", () => {
  it("renders education details without leaking the template label", () => {
    const html = render();
    expect(html).toContain("Coursework in process management");
    expect(html).not.toContain("Modern Sidebar");
  });

  it("does not emit an empty paragraph for an empty education detail", () => {
    const data = structuredClone(exampleResumeData);
    data.sections.education[0].detail = "";
    expect(render({ data })).not.toContain("<p></p>");
  });

  it("preserves the default width and exposes the very-wide class explicitly", () => {
    expect(render()).toContain("resume-sidebar-normal");
    expect(render({ sidebarWidth: "very-wide" })).toContain("resume-sidebar-very-wide");
  });
});
