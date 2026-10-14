import {
  siClaude,
  siCouchbase,
  siExpo,
  siGit,
  siGithub,
  siNextdotjs,
  siOpenjdk,
  siReact,
  siSwift,
  siTailwindcss,
  siTypescript,
  siVercel,
} from "simple-icons";
import { csharp } from "@/assets/icons/csharp";
import { nativewind } from "@/assets/icons/nativewind";
import { playwright } from "@/assets/icons/playwright";
import type { TechIconData } from "@/assets/icons/types";

export type Technology = {
  name: string;
  /** Official site; the whole row links here. */
  url: string;
  icon: TechIconData;
  /** Where I've actually used it. Keeps the section from being a logo wall. */
  usedIn: string;
  /** Still learning it: shown with a "Learning" tag. */
  learning?: boolean;
};

export type TechnologyGroup = {
  label: string;
  items: Technology[];
};

// Simple Icons doesn't ship a Java logo (trademark), so Java uses the OpenJDK
// mark, which is the JDK these projects actually run on.
export const stack: TechnologyGroup[] = [
  {
    label: "Languages",
    items: [
      {
        name: "Java",
        url: "https://openjdk.org",
        icon: siOpenjdk,
        usedIn: "The Millionaire game, the benchmark's native app, and SIFT.",
      },
      {
        name: "TypeScript",
        url: "https://www.typescriptlang.org",
        icon: siTypescript,
        usedIn: "Both scouting projects, the Design App, and this site.",
      },
      {
        name: "Swift / SwiftUI",
        url: "https://www.swift.org",
        icon: siSwift,
        usedIn: "Learning it through small iOS projects.",
        learning: true,
      },
      {
        name: "C#",
        url: "https://learn.microsoft.com/dotnet/csharp/",
        icon: csharp,
        usedIn: "Just starting. Nothing here uses it yet.",
        learning: true,
      },
    ],
  },
  {
    label: "Frontend",
    items: [
      {
        name: "React",
        url: "https://react.dev",
        icon: siReact,
        usedIn: "The UI in all three scouting and design projects.",
      },
      {
        name: "Next.js",
        url: "https://nextjs.org",
        icon: siNextdotjs,
        usedIn: "Scouting Web 2027, the Design App, and this site.",
      },
      {
        name: "React Native",
        url: "https://reactnative.dev",
        icon: siReact,
        usedIn: "The 2026 scouting app, built with Expo for Android tablets.",
      },
    ],
  },
  {
    label: "Tools & platform",
    items: [
      {
        name: "Vercel",
        url: "https://vercel.com",
        icon: siVercel,
        usedIn: "Hosts the 2026 app's web build. The 2027 dashboard is set up for it.",
      },
      {
        name: "Git",
        url: "https://git-scm.com",
        icon: siGit,
        usedIn: "Version control for everything here.",
      },
      {
        name: "GitHub",
        url: "https://github.com",
        icon: siGithub,
        usedIn: "Repos, pull requests, and CI for the 2027 dashboard.",
      },
      {
        name: "Claude Code",
        url: "https://claude.com/product/claude-code",
        icon: siClaude,
        usedIn: "My coding assistant day to day.",
      },
    ],
  },
  {
    label: "Libraries & data",
    items: [
      {
        name: "Expo",
        url: "https://expo.dev",
        icon: siExpo,
        usedIn: "Routing, native modules, and builds for the 2026 scouting app.",
      },
      {
        name: "NativeWind",
        url: "https://www.nativewind.dev",
        icon: nativewind,
        usedIn: "Tailwind-style styling for the 2026 app's screens.",
      },
      {
        name: "Tailwind CSS",
        url: "https://tailwindcss.com",
        icon: siTailwindcss,
        usedIn: "Styling for Scouting Web 2027, the Design App, and this site.",
      },
      {
        name: "Couchbase",
        url: "https://www.couchbase.com",
        icon: siCouchbase,
        usedIn: "Couchbase Lite and Sync Gateway behind both scouting projects, plus the Design App's database.",
      },
      {
        name: "Playwright",
        url: "https://playwright.dev",
        icon: playwright,
        usedIn: "Browser tests for Scouting Web 2027 and the Design App.",
      },
    ],
  },
];
