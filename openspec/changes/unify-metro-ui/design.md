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
