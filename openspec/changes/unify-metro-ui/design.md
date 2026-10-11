# Design

## Context

The fleet runs four Vite + React SPAs on one host. metroLog is the most mature and
is the look the owner wants everywhere: a dark, dense, GitHub-like UI with seven
dark themes switched by a `data-theme` attribute on `<html>`, a bespoke token set
(ink/mist/steel/line/signal + chart colours) and a set of hand-written component
classes (`.btn-primary`, `.form-input`, `.panel`, `.shell-topbar`, …).

`metro-ui` is already a shadcn registry (`shadcn build` → `public/r/*.json`), consumed
from GitHub raw through a `components.json` registry entry (`@metro`). Its current
theme is a generic light/dark shadcn theme that no service uses.

## Goals / Non-goals

- **Goal**: one theme, one shell and one component set, consumed by all four
  frontends, so a user cannot tell which service they are in.
- **Goal**: dark is the default everywhere.
- **Non-goal**: changing any product behaviour or backend contract.
- **Non-goal**: a monorepo. The services stay separate repositories.

## Decisions

### Registry, not an npm package

The owner asked for shadcn, and the fleet already consumes `@metro` from GitHub raw.
The registry keeps the workflow (`npx shadcn@latest add @metro/<name>`) and needs no
publishing pipeline. The cost — vendored copies that can drift — is handled by a
rule: **copied primitives are never edited in the services**; a change lands in
`metro-ui`, then is re-added.

### The theme is one CSS file carrying metroLog's model

`metro-theme` becomes a single `registry:file` that the app imports right after
`tailwindcss`. It carries, in this order:

1. the shadcn↔token mapping (`@theme inline`) so vendored shadcn primitives read the
   fleet's tokens;
2. `:root` with the dark palette (there is no light theme);
3. one `:root[data-theme="…"]` block per extra theme (tokyonight, catppuccin,
   kanagawa, nord, dracula, gruvbox);
4. the base layer the UI relies on (default border colour, pointer cursor, the single
   focus ring);
5. the shared component classes (`.btn-*`, `.form-input`, `.panel`, `.select-trigger`,
   `.date-input`, `.shell-*`, `.sidebar-*`, `.process-*`, `.mention`, …).

The `dark:` variant is scoped to a `.dark` ancestor that is never set, exactly as in
metroLog, so an OS dark preference cannot leak into a theme.

### The theme store is framework-agnostic

metroLog and metroGen use zustand, metroCheck has no store, metroAccounts uses React
context. The registry ships a small store (localStorage + `data-theme` + subscribe)
with no framework dependency, plus a thin hook; a service may adapt it to its own
store instead. The key and the default (`dark`) are fixed in the registry so every
service remembers the same preference name.

### The fleet font is shipped, not assumed

metroLog asked for IBM Plex Sans in its Tailwind config but nothing loaded it, so it
rendered in the operating system's fallback. The shared theme imports the font from
fontsource, which means adopting it changes the glyphs — the only visible difference
the metroLog adoption produced on Stage (everything else stayed pixel-identical).
That is the intended look finally being rendered, and every service now renders the
same text.

### The shell is metroLog's shell

`app-shell` is metroLog's sidebar + topbar with slots: brand, navigation sections,
a footer (user block), and header actions (theme switcher, version badge, help). It
takes the navigation as data so each service passes its own items and nothing else
differs.

### Components are vendored, tokens are shared

Everything that has a look — buttons, cards, inputs, selects, dialogs, badges,
tables, the date and number inputs — is a registry item vendored into
`src/components/ui`. Pages use those, plus the shared classes, and never a raw
palette value.

### Storage keys are the fleet's, and the old ones are read once

The theme lives under `metro.theme` and the sidebar under `metro.sidebarCollapsed` in
every service, so a person's choices follow them across the fleet. Retired theme keys
are read as a fallback, but the collapsed state is not migrated: the sidebar expands
once on the first visit after adoption.

### metroGen brings its own pieces into the theme

metroGen had nine classes the theme lacked (a metric card, a section card, a status
chip and the document preview surface). They are generic, so they moved into the theme
where every service gets them in every theme, instead of staying a second local style
sheet. Its theme catalogue (light, gray, moonfly) was retired with its own store.

### metroCheck added three items to the registry

metroCheck was the only service with a progress bar, an empty state and a time field,
and none of the three existed in `metro-ui`. Rather than keep them local (which is how
the fleet ended up with four different looks), they were added to the registry:
`progress`, `empty-state` and `time-input`. The last one exists because `type="time"`
opens the operating system's clock picker, exactly like `type="date"` did.

## Risks / Trade-offs

- **Copy-in drift**: four copies of every primitive. Mitigated by the "never edit a
  copied file" rule and by a lint rule that rejects hardcoded colours.
- **metroLog is both the source and a consumer**: its own refactor is the riskiest
  step, because its behaviour must not change. It is done first, against its existing
  test suite and Stage.
- **Tailwind configuration differs**: metroLog uses `@config` with a
  `tailwind.config.ts`, metroCheck is CSS-first. The shared theme must work in both;
  the extra `@theme` keys are declared inside the CSS file rather than in a JS config.
- **Volume**: metroGen and metroCheck are effectively re-skinned page by page. They
  are done one page at a time, verified on Stage, with the metroLog page as the
  reference.
