# Spec Delta

## Purpose

Defines the shared visual language of the metro* fleet: the tokens, the themes, the
base layer and the component primitives every service consumes from the `metro-ui`
registry.

## ADDED Requirements

### Requirement: Single source of tokens

The fleet's colours, spacing, radii and typography SHALL be defined once, in the
`metro-theme` registry item, and consumed by every service. An application SHALL NOT
declare its own palette, and SHALL NOT contain a hardcoded colour value in its source.

#### Scenario: A service is themed by the registry
- **WHEN** a service imports the shared theme right after `tailwindcss` and uses the shared classes and primitives
- **THEN** it renders with the fleet palette without any local colour declaration

#### Scenario: A hardcoded colour is introduced
- **WHEN** a service's source contains a literal colour that is not a token reference
- **THEN** the check rejects it

### Requirement: Seven themes, dark by default

The shared theme SHALL ship the dark palette as the default and one override block per
additional theme (tokyonight, catppuccin, kanagawa, nord, dracula, gruvbox), switched
by a `data-theme` attribute on the document root. There SHALL be no light theme. The
`dark:` variant SHALL be scoped so that an operating-system dark preference cannot
change the active palette.

#### Scenario: First visit
- **WHEN** a user opens any service for the first time
- **THEN** the interface is dark

#### Scenario: Theme is chosen and remembered
- **WHEN** a user picks another theme from the switcher and reloads
- **THEN** the same theme is applied again, and the choice is the same key across services

#### Scenario: The operating system prefers dark
- **WHEN** the OS reports a dark colour scheme while a non-dark theme is selected
- **THEN** the selected theme stays in effect

### Requirement: Shared component primitives

The registry SHALL provide the primitives the services share: button, card, input,
select, searchable select, switch, dialog, confirm dialog, badge, status badge, stat
card, page header, table, date input, number input, mention text and empty state.
Each SHALL read its look from the shared tokens only.

#### Scenario: A page uses a shared primitive
- **WHEN** a page renders a shared button, input or dialog
- **THEN** it looks the same as the same primitive in any other service

#### Scenario: A vendored primitive is edited locally
- **WHEN** a service modifies a file copied from the registry
- **THEN** the check rejects it, because the change belongs in the registry

### Requirement: Controls stay the fleet's own

The shared primitives SHALL NOT rely on the browser's native widgets for choices,
dates or numbers, because those render with the operating system's own styling.

#### Scenario: A list of options is presented
- **WHEN** a page asks the user to choose from a list
- **THEN** it uses the shared select or searchable select, not a native select

#### Scenario: A date is entered
- **WHEN** a page asks for a date
- **THEN** it uses the shared date field with its own calendar, not a native date input
