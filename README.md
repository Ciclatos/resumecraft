# ResumeCraft

ResumeCraft is an open source CV builder for creating professional, editable resumes and exporting them to PDF directly from the browser.

It started as a personal CV generator and now keeps that original layout as a reusable product: structured resume data, a modern sidebar template, browser printing styles, demo variants and a simple editable MVP.

## Features

- Editable resume builder at `/builder`.
- Modern CV template with a sidebar layout.
- Real-time preview while editing.
- PDF export through the browser print dialog.
- Local browser storage with `localStorage`.
- No login, backend or server-side storage.
- Structured resume data for config-driven demos.
- Personal demo routes kept separate from the product experience.
- Ready for Vercel deployment.

## Routes

- `/`: ResumeCraft product home.
- `/builder`: editable MVP builder.
- `/cv/base`: personal demo based on the original general CV.
- `/cv/edteam`: personal demo adapted for EDteam.
- `/cv/walmart`: personal demo adapted for Walmart.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

To create a production build:

```bash
npm run build
npm run start
```

## Use the builder

Go to `/builder`, edit the fields in the left panel and preview the resume on the right.

The MVP supports:

- name
- headline
- contact
- location
- summary
- experience
- education
- skills
- tools
- languages
- projects
- optional photo URL or local public asset path

The builder stores data in the browser under `resumecraft.builder.v1`. It does not send personal data to a backend.

The multiline fields use one item per line. Complex sections use `|` as a separator:

```text
Frontend Developer | Northstar Studio | 2024 - Present | Built reusable React components.
```

## Export PDF

Every CV includes a `Descargar PDF` button. It opens the browser print dialog.

Recommended settings:

- Destination: Save as PDF.
- Paper size: A4.
- Scale: 90% to 95% if the browser creates an extra page.
- Margins: None.
- Background graphics: enabled.

The PDF layout is controlled by `styles/print.css`, which keeps the resume close to a one-page A4 document.

## Create sample data

Reusable sample data lives in:

```text
data/resume.ts
```

The builder example is exported as `exampleResumeData`.

Personal demos are stored in:

```text
data/profile.ts
data/variants.ts
```

To add another config-driven demo:

1. Add a new entry to `variants` in `data/variants.ts`.
2. Set a unique `slug`.
3. Fill `variantLabel`, `headline`, `summary`, `focus`, sections and icons.
4. Visit `/cv/your-slug`.

## Create a new template

The current template is implemented with:

```text
components/Resume.tsx
components/Sidebar.tsx
components/Section.tsx
styles/print.css
```

To add a new template:

1. Keep using the `ResumeData` type from `data/resume.ts`.
2. Create a new template component that accepts `ResumeData`.
3. Add template-specific screen styles to `app/globals.css`.
4. Add print rules to `styles/print.css`.
5. Route the builder through a template selector when multiple templates exist.

## Privacy

ResumeCraft is designed to run without accounts or backend storage. Builder data is saved locally in the user's browser. Do not commit private personal information, credentials or secrets into public demo data.

The included Carlos CV routes are demos and are intentionally separated from the main product home and builder.

## Roadmap

- More templates.
- AI-assisted CV adaptation for job posts.
- ATS-friendly mode.
- LinkedIn and GitHub import.
- Version history.
- Richer section editor for repeated entries.
- Template selector in the builder.

## Deploy on Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Use the default Next.js settings.
4. Deploy.

```bash
npm run build
vercel --prod
```

## License

Add a license before publishing broadly as an open source project.
