# Proposal

## Why

The four metro* frontends look and behave differently even though they are used by
the same people for the same job: metroLog has its own design system, metroGen has
its own palette and hand-rolled modals, metroCheck runs a stock shadcn preset, and
the metroAccounts console uses an ad-hoc theme. A person moving between services
has to re-learn the layout, the colours and the controls, and every UI fix has to
be made four times.

`metro-ui` already exists as a shadcn registry, but it carries a generic light/dark
theme and a shell that no service actually uses. metroLog — the reference product —
is the look we want everywhere: its token model (seven dark themes switched by
`data-theme`), its shell, and its component set.

## What Changes

- Turn `metro-ui` into the **single source of truth** for the fleet's UI: the theme
  tokens, the base layer, the theme switcher, the application shell and the shared
  component set, all published as shadcn registry items.
- Replace the registry's generic theme with metroLog's token model, so all services
  share the same palette and the same seven themes.
- Add the components metroLog already ships (button, card, input, select,
  searchable-select, switch, dialog, badge, status-badge, stat-card, page-header,
  date-input, number-input, mention-text, empty-state) to the registry.
- Make **dark** the default theme for every service.
- Adopt the registry in all four frontends in this order: metroLog, metroGen,
  metroCheck, metroAccounts — so the services become visually indistinguishable.
- Bring the metroAccounts owner console into the same system instead of its own
  hand-written theme.

## Capabilities

### New Capabilities
- `design-system`: the shared tokens, themes, base layer and component primitives,
  and the rule that applications do not carry their own colours.
- `app-shell`: the shared sidebar + topbar shell, brand slot, navigation, theme
  switcher and version badge.
- `account-console`: the owner's account console rendered with the shared design
  system.

### Modified Capabilities
_None in this repository; the consuming services keep their own feature specs._

## Impact

- `metro-ui`: new registry items, a rebuilt `public/r/*.json`, OpenSpec documents.
- `metroLog`: consumes the registry instead of its local `components/ui` and style
  sheet (the reference behaviour must not change).
- `metroGen`: replaces its palette, modals and layout with the shared system.
- `metroCheck`: replaces the `radix-nova` preset with the shared system.
- `metroAccounts`: rebuilds the owner console and the invite/reset pages.
- No backend or API changes anywhere.
