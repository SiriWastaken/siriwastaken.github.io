# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
A mixed audience (recruiters, peers, FRC community, anyone curious) who want to see what Sri has built. No single conversion goal; the site is a place to show off work.

## Product Purpose
Personal portfolio for Sri (SiriWasTaken), a student developer. Presents full-stack software, robotics tools, and developer tooling, led by the 610 Scouting App 2026 flagship. Success: visitors understand the work and its real-world use.

## Positioning
Real systems shipped to real users: software used in competition by FRC Team 610, with systems-level depth (offline-first sync via Couchbase Lite and Sync Gateway, a performance benchmark, developer tooling), not tutorial projects.

## Operating Context
Static Next.js site (App Router, Tailwind, motion) hosted on GitHub Pages at siriwastaken.github.io. Projects live in `src/data/projects.ts` with optional images in `src/assets/projects/`.

## Capabilities and Constraints
- Static export only; no server features.
- The scouting app repo is proprietary; present it through description and screenshots, not source links.
- No LinkedIn link, by choice.
- Links: GitHub (SiriWastaken), DMOJ (SiriWastaken).

## Evidence on Hand
Project claims in `src/data/projects.ts` were checked against repos, commits, or READMEs (e.g. match predictor picked the winning alliance 84.7% of the time at the 2026 Ontario Provincial Championships, Technology Division). `IMAGES-NEEDED.md` lists missing imagery; do not fabricate screenshots, testimonials, or employers.

## Product Principles
- Only verified claims; if it isn't in a repo, it isn't on the site.
- Lead with shipped, used work over listing skills.
- Show how things work (flows, mechanisms), not just what they are.
- Honest about status: completed, in progress, or proprietary.
