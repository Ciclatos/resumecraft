# ResumeCraft

ResumeCraft is an open source CV builder for creating professional, editable resumes and exporting them to PDF directly from the browser.

It keeps the strongest parts of the original prototype as a reusable product: structured resume data, a modern sidebar template, browser printing styles, demo variants and an editable MVP.

## Features

- Editable resume builder at `/builder`.
- Five selectable templates: Modern Sidebar, Professional Corporate, Minimal Clean, Creative Tech and ATS Clean.
- Real-time preview while editing.
- PDF export through the browser print dialog.
- Local browser storage with `localStorage`.
- No login, backend or server-side storage.
- Structured resume data for config-driven demos.
- Fictional demo routes kept separate from the product experience.
- Local photo upload with JPG, PNG and WEBP support.
- Typography scale slider, font presets and density controls for better A4 fitting.
- Photo and portfolio QR visibility toggles across templates.
- Ready for Vercel deployment.

## Routes

- `/`: ResumeCraft product home.
- `/builder`: editable MVP builder.
- `/cv/base`: fictional general demo.
- `/cv/edteam`: fictional technology demo.
- `/cv/walmart`: fictional corporate operations demo.

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
- photo upload from the user's device
- template selection
- auto fit visual: compact, normal and wide
- typography scale slider from 85% to 115%
- manual font size: small, normal and large
- density: compact, normal and airy
- show or hide photo
- show or hide portfolio QR

Experience, education and projects can be added, removed and reordered directly in the builder. Skills, tools, focus areas and languages can also be added or deleted from the UI.

The builder stores data in the browser under `resumecraft.builder.v2`. It does not send personal data to a backend.

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

Fictional demos are stored in:

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

The current templates are implemented with:

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
5. Add it to the `ResumeTemplate` union and the builder selector.

## Template guide

- Modern Sidebar: general modern resumes with a strong visual sidebar.
- Professional Corporate: traditional companies, administration, retail operations and finance.
- Minimal Clean: technology profiles that need a clean, readable presentation.
- Creative Tech: product, AI, portfolio and creative technology roles.
- ATS Clean: job portals, applicant tracking systems and recruiter-first readability.

## Privacy

ResumeCraft is designed to run without accounts or backend storage. Builder data is saved locally in the user's browser. Do not commit private personal information, credentials or secrets into public demo data.

The included CV routes are fictional demos and are intentionally separated from the main product home and builder.

## Roadmap

- More templates.
- AI-assisted CV adaptation for job posts.
- ATS-friendly mode.
- LinkedIn and GitHub import.
- Version history.
- Richer section editor for repeated entries.
- PDF preview calibration per template.

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
