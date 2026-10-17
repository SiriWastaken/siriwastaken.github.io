# sri-portfolio

My personal site: the projects I've built, what I built them with, and what I'm working on now.

Next.js (App Router), React, TypeScript, and Tailwind CSS. Every page is statically generated, and no client-side JavaScript is shipped beyond what Next.js needs to run.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build
```

No environment variables are required. Set `NEXT_PUBLIC_SITE_URL` (for example `https://example.com`) once the site has a domain; it's used for the sitemap, robots.txt, and Open Graph URLs. On Vercel the production URL is picked up automatically.

## Layout

```text
src/
├── app/                  Routes, metadata, sitemap, robots, OG image, icon
│   └── projects/[slug]/  One page per project that has `details`
├── components/           One folder per section (hero, projects, stack, frc, about, contact…)
│   └── ui/               Shared primitives: Container, Section, links, MetaList
├── data/                 Everything the site says
│   ├── site.ts           Name, description, GitHub/DMOJ URLs
│   ├── projects.ts       All projects: summaries, highlights, case-study content
│   ├── stack.ts          Technologies, icons, and where each was used
└── assets/projects/      Images, one folder per project slug
    └── <slug>/
        ├── hero/         Main image (home page + top of the project page)
        ├── screenshots/  Screenshots section of the project page
        ├── diagrams/     Architecture section of the project page
        └── index.ts      Imports the images above and describes them
```

## Adding a project

1. Add an entry to `src/data/projects.ts`. `tier` decides how prominent it is on the home page (`flagship`, `featured`, or `additional`); adding `details` gives it its own page.
2. Optionally create `src/assets/projects/<slug>/` with an `index.ts` (copy one of the existing ones), and register it in `src/assets/projects/index.ts`.

## Adding screenshots

Drop the file in the right folder, then import it in that project's `index.ts`:

```ts
import dashboard from "./screenshots/dashboard.png";

const assets: ProjectAssets = {
  hero: { src: dashboard, alt: "The Averages view sorted by teleop points" },
  screenshots: [{ src: dashboard, alt: "…", caption: "Optional caption" }],
};
```

Then delete that image's entry from `planned` in the same file.

### Placeholders

Each project's `index.ts` has a `planned` list: the shots still to take, where to save them, and their aspect ratio. In `npm run dev` these render as labelled frames exactly where the images will appear. They never appear on the live site unless you set `NEXT_PUBLIC_SHOW_IMAGE_PLACEHOLDERS=true`.

Images go through `next/image` (resized, AVIF/WebP, blurred placeholder). A project with a hero image shows it on the home page instead of its data-flow diagram; the diagram moves into the Architecture section of its project page.

## Icons

Technology icons come from [Simple Icons](https://simpleicons.org) (CC0). Simple Icons doesn't include a Java logo, so Java uses the OpenJDK mark.
