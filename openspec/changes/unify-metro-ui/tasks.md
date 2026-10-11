# Tasks

## 1. Registry foundation (metro-ui)

- [x] 1.1 Port metroLog's token model into `registry/metro-theme/metro-theme.css`: the `@theme inline` mapping, the dark `:root`, one `:root[data-theme="…"]` block per theme (tokyonight, catppuccin, kanagawa, nord, dracula, gruvbox), and the base layer (default border colour, pointer cursor, focus ring); verify a scratch Vite page renders every token under every theme.
- [x] 1.2 Move the shared component classes out of metroLog's `styles.css` into the same file (buttons, form controls, panels, shell, sidebar, process badges, mentions); verify the class list matches metroLog's, minus app-only rules.
- [x] 1.3 Add the `theme-store` registry item (framework-agnostic: localStorage key, `data-theme`, subscribe, hook) with `dark` as the default; verify a scratch page switches themes and remembers the choice after a reload.
- [x] 1.4 Replace `app-shell` with metroLog's shell: brand slot, navigation sections as data, footer user block, header actions (theme switcher, version badge, help); verify it renders with a sample navigation.
- [x] 1.5 Add the component items: `button`, `card`, `input`, `select`, `searchable-select`, `switch`, `dialog`, `app-dialog`, `badge`, `status-badge`, `stat-card`, `page-header`, `table`, `date-input`, `number-input`, `mention-text`, `empty-state`; verify each item builds with `shadcn build`.
- [x] 1.6 Regenerate `public/r/*.json`, tag the registry (`v0.x.0`), and document the consumption snippet in `README.md`.

## 2. metroLog adopts the registry (reference)

- [x] 2.1 Point metroLog at the new registry version and re-add every primitive; delete the local duplicates under `src/components/ui`.
- [x] 2.2 Replace the local style sheet with the shared `metro-theme` import; delete the classes now living in the registry.
- [x] 2.3 Swap metroLog's shell for the registry `app-shell` with its navigation as data; keep the behaviour identical (mobile drawer, collapse, active item).
- [x] 2.4 Verify: `npm run check` passes, the app looks unchanged on Stage, all seven themes still switch, and no hardcoded colour remains in `src`.

## 3. metroGen adopts the registry

- [x] 3.1 Install the registry and the shared theme; remove the bespoke palette and font setup.
- [x] 3.2 Replace the local `Modal`, `DeleteConfirmModal`, `PasswordInput` and layout with the registry primitives and `app-shell`; keep each screen's behaviour.
- [ ] 3.3 Re-skin the pages against the metroLog reference, one at a time (login, dashboard, generation, admin*), verifying on Stage after each. The remaining native controls found by the sweep: `<select>` in `AdminUsersPage`, `UserDetailsPage`, `AdminMethodologiesPage` (use the registry `select`); `window.confirm` in `GenerationPage` (use the fleet dialog); `type="number"` in `AdminMethodologiesPage`, `GenerationPage`, `AdminEtalonsPage` (use `NumberInput`).
- [ ] 3.4 Verify: build and lint pass, and a side-by-side screenshot with metroLog is indistinguishable in structure and colour.

## 4. metroCheck adopts the registry

- [ ] 4.1 Replace the `radix-nova` preset with the shared theme and registry components; keep the dark default.
- [ ] 4.2 Rebuild the login and the two pages (dashboard, scheduler) with the shared shell and primitives.
- [ ] 4.3 Verify: build passes, the sign-in screen and both pages match the metroLog reference.

## 5. metroAccounts console adopts the registry

- [ ] 5.1 Replace the console's ad-hoc theme with the shared theme and primitives; keep the dark default.
- [ ] 5.2 Rebuild the owner console (employee list, per-service flags and roles, create dialog) and the invite/reset pages with the shared shell and controls.
- [ ] 5.3 Verify: the console matches the metroLog reference and the account flows still work end to end.

## 6. Cross-service verification

- [ ] 6.1 Walk the four sign-in screens side by side; confirm they are indistinguishable.
- [ ] 6.2 Walk the four dashboards and one list/table screen each; confirm the same shell, spacing, controls and empty states.
- [ ] 6.3 Add a lint rule (or a small test) in each service that rejects hardcoded colours in `src` and edits to vendored registry files.
- [ ] 6.4 Record the outcome in the vault (`servers/mkair-server-tmn/metro-accounts.md` and the service notes) and close this change.
