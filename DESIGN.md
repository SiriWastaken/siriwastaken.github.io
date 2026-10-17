---
name: Sri Portfolio
description: Calm, spacious, Apple-style portfolio in system type with one link-blue accent.
colors:
  paper: "#fbfbfd"
  paper-surface: "#f5f5f7"
  ink: "#1d1d1f"
  muted-ink: "#6e6e73"
  rule: "#e5e5ea"
  rule-strong: "#d2d2d7"
  link-blue: "#0066cc"
  on-link-blue: "#ffffff"
  black: "#000000"
  black-surface: "#1c1c1e"
  black-ink: "#f5f5f7"
  black-muted: "#a1a1a6"
  black-rule: "#2c2c2e"
  black-rule-strong: "#424245"
  sky-blue: "#2997ff"
typography:
  display:
    fontFamily: "SF Pro Display, -apple-system, Helvetica Neue, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 8vw, 6rem)"
    fontWeight: 600
    letterSpacing: "-0.03em"
  body:
    fontFamily: "SF Pro Text, -apple-system, Helvetica Neue, system-ui, sans-serif"
    fontSize: "1rem"
  label:
    fontFamily: "SF Pro Text, -apple-system, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
rounded:
  card: "24px"
  image: "16px"
  pill: "9999px"
  focus: "6px"
---

# Design System: Sri Portfolio

## Overview

**Creative North Star: "The Quiet Showroom"**

One idea per screen, lots of air, large semibold type, and soft rounded surfaces. System fonts mean it renders in San Francisco on Apple devices. Light and dark follow the system setting.

**Key Characteristics:**
- One accent: link blue. No second hue.
- Whitespace and alternating paper tones separate sections; no hairline-heavy layouts.
- Rounded cards, pill buttons, a translucent blurred header.

## Colors

Cool neutrals plus a single blue.

- **Link Blue** (#0066cc light, #2997ff dark): buttons, links, focus, bullets.
- **Paper** (#fbfbfd) / **Black** (#000000): page. **Paper Surface** (#f5f5f7) / **Black Surface** (#1c1c1e): cards and alternate sections.
- **Ink** (#1d1d1f) / **Black Ink** (#f5f5f7): text. **Muted Ink** (#6e6e73) / **Black Muted** (#a1a1a6): secondary text.
- **Rule** (#e5e5ea) and **Rule Strong** (#d2d2d7): hairlines, used sparingly.

**The One Blue Rule.** Blue marks only what you can act on.

## Typography

System stack, no web fonts. Display is semibold with -0.03em tracking, up to 6rem. Body is regular at 1rem and up. Group labels are 0.875rem semibold muted, never uppercase or monospace.

## Layout

Centered hero, then left-aligned sections inside a 7xl container with generous vertical rhythm (py-20 to py-32). Stack and footer sit on the surface tone.

## Elevation & Depth

Flat. Depth comes from tone (surface on paper) and the header's backdrop blur. No shadows.

## Shapes

Cards 24px, images 16px, buttons fully pill-shaped, bullets round.

## Components

### Buttons and links
Primary is a blue pill with white text; secondary is a surface pill. Inline links are blue text, underlined on hover. Focus is a 2px blue ring.

### Cards
Featured projects sit on the surface tone with 24px corners. Flagship images are clipped to a 24px surface. No nested cards.

## Do's and Don'ts

### Do:
- **Do** keep one idea and one primary action per screen.
- **Do** keep motion short, eased out, and wrapped in reduced-motion handling.

### Don't:
- **Don't** add shadows, gradients, section numbers, uppercase labels, or monospace labels.
- **Don't** claim anything the repos can't back up (see PRODUCT.md).
