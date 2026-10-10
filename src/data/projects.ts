import type { Project, ProjectTier } from "./types";

/*
 * Every claim below was checked against the project's source code, commit
 * history, or README. If something isn't in the repo, it isn't here.
 *
 * To add a project: append an entry, then (optionally) create
 * src/assets/projects/<slug>/ and register it in src/assets/projects/index.ts.
 */
export const projects: Project[] = [
  {
    slug: "scouting-app-2026",
    title: "610 Scouting App — 2026",
    shortTitle: "Scouting App 2026",
    year: "2026 season",
    category: "Mobile app · FRC",
    status: "completed",
    statusNote: "Built for Team 610's 2026 season",
    tier: "flagship",
    summary:
      "An offline-first Android scouting app that lets six scouts record every robot in a match and keeps their data in sync across the team's tablets.",
    technologies: [
      "TypeScript",
      "React Native",
      "Expo",
      "Couchbase Lite",
      "Sync Gateway",
      "NativeWind",
      "The Blue Alliance API",
    ],
    role: "One of the main developers on a shared team codebase",
    highlights: [
      "Submissions are written to a local Couchbase Lite database first, then replicated continuously in both directions through Sync Gateway, so scouting keeps working when the venue network doesn't.",
      "A five-step match flow (start, auto, teleop, review, human player), with autonomous paths drawn by hand on an image of the field.",
      "Strategy tools built on the synced data: multi-team comparison, a third-robot selector, match plans with climb estimates and role suggestions, and a drag-and-drop picklist.",
      "Team lists, match schedules, and rankings pulled from The Blue Alliance API.",
    ],
    sourceNote: "Private team repository",
    flow: {
      caption: "How a match gets from a scout's tablet to the strategy team",
      steps: [
        {
          label: "Scout tablets",
          detail: "Six Android tablets, one robot each",
        },
        { label: "Couchbase Lite", detail: "Local write, works offline" },
        {
          label: "Sync Gateway",
          detail: "Continuous push and pull replication",
        },
        {
          label: "Analysis tabs",
          detail: "Stats, averages, box plots, picklist",
        },
      ],
      aside: {
        label: "The Blue Alliance API",
        detail: "Teams, schedules, rankings",
      },
    },
    details: {
      overview: [
        "The match scouting app FRC Team 610 used for the 2026 season. Scouts run it on Android tablets during qualification matches; each one follows a single robot and records its autonomous routine, teleop scoring, and endgame.",
        "Every tablet writes to its own local database and syncs with the others through Couchbase Sync Gateway. The same app then turns that data into the views the strategy side uses during an event: per-team stats, sortable averages with a Day 1 / Day 2 split, box plots, match planning tools, scout coverage, and a picklist board for alliance selection.",
      ],
      problem: [
        "Every qualification match has six robots on the field, and by alliance selection the team needs trustworthy data on all of them. That data has to be entered quickly by scouts watching a live match, it has to survive unreliable venue networks, and it has to be usable during the event rather than after it.",
      ],
      role: [
        "Strategy tools: the third-robot selector, multi-team comparison and match review, and the match planning view.",
        "Robot betting, a match-prediction game for scouts stored as its own document type in Couchbase.",
        "Expert (pit) scouting with robot photos stored in the database and rendered on the stats pages.",
        "Correcting submitted data: picking a match that already has a record loads it for editing and re-submission, plus a way to clear a bad record.",
        "Workflow changes from scout feedback: highlighting a scout's assigned matches and teams, a reworked match selector, a flipped-field option for autos, and an emergency scout button.",
        "The web build's layout (a vertical navigation rail, typography, and spacing), its Vercel deployment, and a rewrite of the project documentation for future developers.",
      ],
      architecture: [
        "Expo and React Native with file-based routing through Expo Router. Screens are grouped into tabs; the match flow is its own set of routes that share a single scouting-data object instead of passing props through five screens.",
        "A service layer sits between the UI and the database: couchbase.ts handles initialization, replication, and document reads and writes; aggregateData.ts recomputes a team's rollups whenever a match for that team is submitted; matchPlanningUtils.ts holds the climb estimates and role generation used by match planning.",
        "Couchbase Lite is a native module, so the Android app runs as an Expo development build rather than in Expo Go. For the web build, a couchbase.web.ts file, which Metro picks over couchbase.ts on web, talks to Sync Gateway's REST API with stale-while-revalidate caching.",
        "The navigation adapts to the platform: a bottom tab bar on Android tablets, a resizable sidebar on wide web screens.",
      ],
      challenges: [
        {
          title: "Data entry that can't depend on the network",
          body: "Competition Wi-Fi is not something to rely on. Writing locally first and letting the replicator push and pull in the background means a scout can always submit, and other devices catch up once they can reach Sync Gateway.",
        },
        {
          title: "Fixing data after it's submitted",
          body: "Scouts make mistakes mid-match. Rather than letting a second submission create a duplicate record, selecting an already-scouted match loads the existing document so it can be corrected and saved again.",
        },
        {
          title: "Photos across devices",
          body: "Robot photos from pit scouting are stored with the scouting documents so they replicate like any other data. Getting them to show up reliably on other devices, not just the one that took them, took several rounds of fixes, including a database authentication bug.",
        },
        {
          title: "One codebase, two platforms",
          body: "The same code ships as a native Android app and a web build. Platform-specific files keep the database layer separate while the screens stay shared.",
        },
      ],
    },
  },
  {
    slug: "scouting-web-2027",
    title: "610 Scouting Web — 2027",
    shortTitle: "Scouting Web 2027",
    year: "2027 season",
    category: "Full-stack web · FRC",
    status: "in-development",
    tier: "flagship",
    summary:
      "A Next.js dashboard for Team 610's scouting data, with its own sign-in, server-enforced roles, live updates over WebSockets, and an operations panel for mentors.",
    technologies: [
      "TypeScript",
      "Next.js",
      "React",
      "Tailwind CSS",
      "WebSockets",
      "Couchbase Sync Gateway",
      "OpenID Connect",
      "Playwright",
      "GitHub Actions",
      "Vercel",
    ],
    role: "Sole developer",
    highlights: [
      "Google and Apple sign-in written directly against OpenID Connect (state, nonce, PKCE, and ID-token signature checks) without an auth library.",
      "Five roles (Owner, Mentor, Scout lead, Scout, Member) decided in one permissions module and enforced on the server, with an admin panel for health checks, realtime and sync monitoring, user management, and an audit log.",
      "Pages update live: the server long-polls Sync Gateway's changes feed and relays an allow-listed set of fields over a session-checked WebSocket.",
      "A test bench with unit, property-based, integration, security, contract, stress, and Playwright end-to-end suites, run in GitHub Actions.",
    ],
    githubUrl: "https://github.com/SiriWastaken/610-scouting-web-2027",
    flow: {
      caption: "How a change in the scouting database reaches an open dashboard",
      steps: [
        {
          label: "Sync Gateway",
          detail: "Scouting, pit, and aggregate documents",
        },
        { label: "Changes feed", detail: "Server long-polls from a sequence" },
        {
          label: "WebSocket relay",
          detail: "Session-checked, allow-listed fields",
        },
        {
          label: "Dashboard",
          detail: "Merges by revision, resumes on reconnect",
        },
      ],
      aside: {
        label: "Google / Apple sign-in",
        detail: "Accounts, sessions, five roles",
      },
    },
    details: {
      overview: [
        "A web platform for analysing Team 610's scouting data. It reads the documents the scouting app produces from Couchbase Sync Gateway and presents them as Teams, Averages, Box Plot, Strategy, and Coverage views.",
        "Everyone signs in with Google or Apple first. New accounts wait for approval, and what each person can see and do depends on their role. Mentors and the Owner get an operations panel covering system health, the realtime feed, sync status, API metrics, users, sessions, and an audit log.",
      ],
      problem: [
        "In 2026, data entry and analysis lived in the same tablet app. This project moves the analysis side to the web: it reads the same Couchbase data, works on any device with a browser, and requires an approved, signed-in account to see anything.",
      ],
      role: [
        "Everything in the repository: the Next.js app, the authentication system, the realtime server, the admin panel, the test bench, and the documentation.",
      ],
      architecture: [
        "Next.js App Router. Everything behind sign-in sits in one route group with a shared sidebar shell. A proxy redirects signed-out visitors to the welcome page, and every page and API route re-checks the session on the server.",
        "A server-only repository reads aggregate and pit documents from Sync Gateway's REST API, with a 20-second snapshot cache. Accounts, sessions, and the audit log live in a separate Sync Gateway database, or in a local file during development.",
        'Roles and permissions are defined in a single module, and API routes go through one guard that answers "who is asking?" for every request.',
        "Live updates run on WebSockets. Locally, a small Node server handles the upgrade and hands everything else to Next.js; on Vercel, the same route uses Vercel's WebSocket support with Fluid Compute.",
      ],
      challenges: [
        {
          title: "Keeping every open tab consistent",
          body: "Each page renders from a snapshot plus that snapshot's sequence number, then subscribes from that sequence. The browser keeps the newest revision it has seen for each document, ignores stale or out-of-order events, and merges REST results against the same store. After a disconnect it reconnects with backoff and resumes from the last sequence it applied; if Sync Gateway rejects that sequence, the page reloads its data in place.",
        },
        {
          title: "Privacy on a live feed",
          body: "The relay only forwards known document types and explicitly selected fields; scout names, photos, and free-text notes never leave the server. Each socket's session is re-checked every minute, and the connection closes as soon as a session is revoked.",
        },
        {
          title: "WebSockets across two runtimes",
          body: "A plain Next.js dev server can't hold a WebSocket open on an app route, so local development runs through a small custom server while production uses Vercel's WebSocket support. Both share the same protocol and bridge code.",
        },
        {
          title: "Tests that can't quietly pass",
          body: "The test runner keeps a manifest of required test files and minimum test counts, and fails if any suite is skipped or shrinks. Contract tests run against a real Couchbase and Sync Gateway in Docker, and the fake Sync Gateway used elsewhere models the real server's reserved-property rules.",
        },
      ],
    },
  },
  {
    slug: "claudeium",
    title: "Claudeium",
    year: "2026",
    category: "Developer tool · Claude Code plugin",
    status: "in-development",
    statusNote: "v0.2.0, not published yet",
    tier: "featured",
    summary:
      "An execution and verification layer for AI-assisted development: a task ledger where nothing counts as done until a check has passed against the files it covers.",
    technologies: ["JavaScript", "Node.js", "Claude Code plugin", "JSON"],
    role: "Sole developer",
    highlights: [
      "A task is verified only through a recorded passed check, and the evidence is tied to a fingerprint of the files it covers, so later edits mark it STALE.",
      "Parallel work is limited to three tasks at once, and tasks that share files are refused, so workers can't overwrite each other.",
      "Handoffs are versioned, validated snapshots another agent can resume from; the ledger uses atomic writes and a directory lock, and never overwrites a corrupt file.",
      "The core uses only Node's standard library and is agent-agnostic; Claude Code is the first adapter. 36 tests pass.",
    ],
    sourceNote: "Not published yet",
    details: {
      overview: [
        "Claudeium is built around one principle: any compatible agent can contribute, every meaningful result is traceable, and completion needs evidence. It ships as a Claude Code plugin on top of a small platform-independent core, plus a portable AGENTS.md that any coding agent can follow.",
        "A run investigates, proposes a plan with tasks, owned files, dependencies, and a verify command, waits for approval, then loops: a worker agent per task, then an independent verifier agent, then recorded evidence. It never commits or pushes.",
      ],
      problem: [
        "When an AI agent says a task is done, nothing backs that up, and later edits can quietly invalidate it. Claudeium makes done mean something, with small enforced rules instead of a promise.",
      ],
      role: ["Solo project: the ledger core, the plugin's agents, skills and hooks, the tests, and the documentation."],
      architecture: [
        "The core is a command-line tool over a JSON ledger file, with no daemon, database, or server. Task states are pending, running, done, verified, failed, and blocked, and the core never executes plan commands itself, because model-written commands should go through the host's permission prompts.",
        "A Stop hook stops a session from finishing with unfinished tasks. It deliberately fails open, so a broken guard can't trap a session.",
        "The docs are explicit about what isn't done: evidence is model-reported by the verifier, file ownership is instructed rather than enforced at edit time, redaction is best-effort, and it has been exercised end to end only on a small task.",
      ],
      challenges: [
        {
          title: "Making evidence expire",
          body: "A passing check is only meaningful for the files it ran against. Each check is bound to a content fingerprint of the task's owned files, so any later change shows the task as STALE until it is verified again.",
        },
        {
          title: "Not trusting its own state",
          body: "The ledger is schema-versioned, written atomically, and guarded by a lock. A corrupt ledger is reported rather than overwritten, and secrets in recorded output are redacted and truncated.",
        },
        {
          title: "Parallelism without collisions",
          body: "Tasks declare the files they own, and a directory counts as owning its contents. Batches must be file-disjoint, which is checked when a task starts.",
        },
      ],
    },
  },
  {
    slug: "millionaire",
    title: "Who Wants to Be a Millionaire — ICS3U Final",
    shortTitle: "Millionaire (ICS3U)",
    year: "2026",
    category: "Desktop game · Java",
    status: "completed",
    statusNote: "Grade 11 Computer Science final project",
    tier: "additional",
    summary:
      "My Grade 11 Computer Science final: a Who Wants to Be a Millionaire–style quiz game in Java Swing, with every screen drawn by hand in Java2D.",
    technologies: ["Java", "Swing", "Java2D"],
    role: "Sole developer",
    highlights: [
      "A 16-question money ladder with safe points, a play-or-walk decision, and timed or untimed modes.",
      "Four lifelines (Swap, Audience Poll, 25/75, Phone a Friend) and a question bank loaded from a CSV file.",
      "Custom-drawn UI and animations driven by Swing timers, with game state kept apart from rendering and input.",
    ],
    githubUrl: "https://github.com/SiriWastaken/Who-Wants-To-Be-a-Millionaire",
    details: {
      overview: [
        '"FINAL ANSWER?" is a quiz game modelled on Who Wants to Be a Millionaire, built as my final project for ICS3U. You climb a 16-step money ladder, use lifelines, and decide whether to keep playing or walk away with what you have.',
        "It's a single-player desktop game in plain Java with no external libraries, 17 classes in all.",
      ],
      role: ["Solo project."],
      architecture: [
        "GameSession holds the game state: the current question, winnings, safe points, the timer, and which lifelines are used. GameScreenRenderer draws everything, and GameScreenPanel handles input and coordinates the two.",
        "QuestionBank builds a deck of 16 questions of increasing difficulty and finds same-difficulty replacements for the Swap lifeline. QuestionParser reads the question CSV, including quoted values.",
        "Every screen (main menu, mode selector, intro, money ladder, play-or-walk, game over, win screen) is a custom-painted Swing panel. Animations run on javax.swing.Timer.",
      ],
      challenges: [
        {
          title: "Input during animations",
          body: "Once an answer is locked in, the game plays a reveal animation before showing the result. Lifelines could still be triggered during that window; the fix was to block them as soon as the reveal starts.",
        },
        {
          title: "Keeping drawing code manageable",
          body: "With no layout managers doing the work, the renderer was split out from the game logic so the drawing code and the rules could change independently.",
        },
      ],
    },
  },
  {
    slug: "design-app",
    title: "610 Design App",
    year: "2026",
    category: "Full-stack web · FRC",
    status: "in-development",
    statusNote: "Replacing the team's spreadsheet and Drive folder",
    tier: "flagship",
    summary:
      "A mobile-first PWA for logging robot prototype tests with photos and video, then comparing iterations, with server-enforced roles and offline drafts.",
    technologies: [
      "TypeScript",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Couchbase",
      "Auth.js",
      "Zod",
      "S3 / R2",
      "Vitest",
      "Playwright",
    ],
    role: "Sole developer",
    highlights: [
      "Every server action goes through one pipeline (authenticate, rate limit, validate, authorize, handler, audit), and permissions for five roles live in a single module.",
      "Metric definitions are immutable versions, and each entry snapshots the definitions it used, so old seasons still render exactly as logged.",
      "Photos and video upload straight from the browser to object storage through presigned URLs and are named automatically from season, subsystem, prototype, and iteration.",
      "Entry drafts autosave to IndexedDB, and creates are idempotent so an offline retry can't duplicate an entry.",
    ],
    githubUrl: "https://github.com/SiriWastaken/610-Design-App",
    details: {
      overview: [
        "A tool for Team 610's design process. Each test of a prototype is logged with its metrics, notes, and media, and later iterations can be compared against earlier ones.",
        "It's built as a phone-first PWA, since tests happen next to the robot, with Google sign-in and a People panel where the owner assigns roles.",
      ],
      problem: [
        "Test results lived in a spreadsheet, with photos and video in a separate Drive folder, so linking a result to its footage meant renaming files by hand. Here every entry, metric, note, and file is linked automatically and media is named for you.",
      ],
      role: [
        "Everything in the repository: the app, the data layer, the permission model, the tests, and the user guide.",
      ],
      architecture: [
        "Next.js App Router. Routes stay thin and call a per-feature service layer; the only code that talks to Couchbase is the repository layer, which uses parameterized SQL++ and key-value access. Every query is checked against the index file by a script that runs EXPLAIN.",
        "Roles run viewer, logger, editor, admin, owner. The role in the session is only a hint: server code re-reads the user on each request, so deactivation and role changes apply immediately. Individual metric fields can carry their own edit lock that overrides the role default.",
        "Media bytes go from the browser to S3-compatible storage; Couchbase stores only metadata. Reads use short-lived signed URLs and the bucket is never public.",
      ],
      challenges: [
        {
          title: "Old data that still renders",
          body: "Editing a metric inserts a new version instead of changing the old one, and each entry stores a snapshot of the definitions it was logged against. Past seasons render without joins and never change under you.",
        },
        {
          title: "Two people saving at once",
          body: "Concurrent edits use compare-and-swap, and a new metric version is claimed with an atomic slot insert, so two simultaneous saves can't fork a metric's history.",
        },
        {
          title: "Logging with a bad connection",
          body: "Drafts are kept on the device and restored on return. Entry ids are generated on the client, which makes a retried create harmless.",
        },
      ],
    },
  },
  {
    slug: "scouting-benchmark",
    title: "Scouting App Benchmark: React Native vs Native Java",
    shortTitle: "Scouting Benchmark",
    year: "2026",
    category: "Performance engineering · Android",
    status: "completed",
    statusNote: "Measured on one scouting tablet",
    tier: "featured",
    summary:
      "A controlled benchmark of the scouting app against a native Java rewrite, run on the actual tablet to decide whether a rewrite would be worth it.",
    technologies: ["React Native", "Java", "Android", "Couchbase Lite", "Python"],
    role: "Sole developer",
    highlights: [
      "Both apps run the same scripted workload through a shared Java instrumentation harness that injects touches and records latency, frames, CPU, and memory.",
      "Every run's final state is checked against a reference model, and runs with a wrong checksum, lost taps, or a debug build are excluded from the statistics.",
      "On the Fire tablet, native Java was faster on taps (32 vs 75 ms median) and screen changes (55 vs 234 ms) and used far less CPU and memory; React Native had smoother frames under background load.",
      "Reported with its limits: one tablet, three runs per cell, sync not tested.",
    ],
    githubUrl: "https://github.com/SiriWastaken/reactN-vs-Java-android-testbench",
    details: {
      overview: [
        "The 2026 scouting app is React Native. This project asks, with repeatable measurements rather than opinion, whether a native Android rewrite would give a meaningful advantage in responsiveness, stability, or memory.",
      ],
      role: ["Solo project: both implementations of the workload, the harness, the analysis scripts, and the report."],
      architecture: [
        "Two independent apps implement the same state machine and persistence, one in React Native with Hermes and one in Java with Android Views. A shared instrumentation library injects the touches and samples CPU, memory, and frame times.",
        "A Python reference implementation of the state machine produces golden checksums. Both apps' reducers are unit-tested against it, and every benchmark run compares its final state and database contents with the reference.",
      ],
      challenges: [
        {
          title: "Making the comparison fair",
          body: "The instrument has to be identical for both apps, and the workload deterministic. The workload is generated from one spec into event files with expected checksums, so a difference in results can't come from a difference in input.",
        },
        {
          title: "Catching a flaw in my own driver",
          body: "A first set of tablet runs lost one React Native tap per cycle because of a defect in the test driver. The affected workloads were rerun after the fix and the earlier set kept separate, rather than blended in.",
        },
      ],
    },
  },
  {
    slug: "sift",
    title: "SIFT",
    year: "2026",
    category: "Developer tool · Java CLI",
    status: "in-development",
    tier: "additional",
    summary:
      "A command-line tool that inspects, health-checks, and diffs the project you're standing in, and reports `unknown` instead of guessing.",
    technologies: ["Java", "Maven", "JUnit"],
    role: "Sole developer",
    highlights: [
      "Four commands: inspect, check (runs the build and tests), doctor (config and repository problems, each with its evidence), and diff.",
      "Runs only commands it knows are right for the detected Maven, Gradle, Node, or Python project, never reads commands from project files, and never goes through a shell.",
      "Tests build throwaway git repositories, and CI runs on Linux, macOS, and Windows.",
    ],
    githubUrl: "https://github.com/SiriWastaken/sift",
    details: {
      overview: [
        "SIFT answers four questions about the project you're standing in: what is it, does it look healthy, what might be wrong, and what did I change. It runs locally, needs no network and no accounts, and prints only what it can back with evidence.",
      ],
      problem: [
        "Opening an unfamiliar repository means running git status, finding the build tool, guessing the test command, and checking whether the Java or lockfile setup is sane. SIFT does that routine in one place and never invents a command a project didn't ask for.",
      ],
      role: ["Solo project: the tool, its tests, the CI setup, and the documentation."],
      architecture: [
        "Detection reads marker files in the current directory (pom.xml, build.gradle, package.json, pyproject.toml) and declared dependencies, so framework and test framework come from evidence rather than guesses. A directory walk skips build output and dependency folders, never follows symlinks, and stops at 100,000 files.",
        "check runs only the commands known to be right for the detected project, never reads commands from project files, and never goes through a shell. A failed build skips the tests, and each step has a 10 minute timeout.",
        "doctor prints findings only, each with its evidence: conflict markers with file and line, a Java version newer than the runtime, tracked credential-looking files, missing lockfiles.",
      ],
      challenges: [
        {
          title: "Saying unknown instead of guessing",
          body: "Anything SIFT can't identify is reported as unknown. That keeps its output trustworthy, but it means every detector has to prove what it claims from a marker file or a declared dependency.",
        },
        {
          title: "Testing against real repositories",
          body: "The tests build throwaway git repositories, so they exercise the same git behaviour users see. CI runs on Linux, macOS, and Windows to catch path and process differences.",
        },
      ],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByTier(tier: ProjectTier): Project[] {
  return projects.filter((project) => project.tier === tier);
}

export function getProjectsWithDetails(): Project[] {
  return projects.filter((project) => project.details);
}
