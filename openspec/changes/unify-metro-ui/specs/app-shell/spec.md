# Spec Delta

## Purpose

Defines the application shell every metro* service renders around its pages, so the
frame — brand, navigation, header actions — is the same everywhere.

## ADDED Requirements

### Requirement: One shell structure

Every service SHALL render its pages inside the shared shell: a collapsible sidebar
with the brand, grouped navigation and a footer block, and a top bar with the page
actions, the theme switcher and the version badge.

#### Scenario: A service renders a page
- **WHEN** an authenticated user opens any page of any service
- **THEN** the page appears inside the same shell frame, with the same spacing and the same header

#### Scenario: The sidebar is collapsed
- **WHEN** the user collapses the sidebar
- **THEN** the navigation becomes icon-only with the active item marked, and the choice persists while navigating

#### Scenario: A narrow viewport
- **WHEN** the viewport is narrow
- **THEN** the navigation is reachable through the drawer and the pages stay usable

### Requirement: Navigation is data

A service SHALL describe its navigation as data (sections of labelled links with
optional icons), so the shell carries no service-specific markup.

#### Scenario: A service adds a section
- **WHEN** a service passes a new navigation section to the shell
- **THEN** it appears in the sidebar with the shared styling and no shell change

#### Scenario: The active route
- **WHEN** a route is open
- **THEN** its navigation entry is marked as current

### Requirement: Shared header actions

The shell SHALL provide the theme switcher and the application version badge in the
top bar, and SHALL let a service add its own header actions next to them.

#### Scenario: Switching theme
- **WHEN** the user opens the theme switcher and picks a theme
- **THEN** the whole interface changes theme immediately

#### Scenario: Version badge
- **WHEN** the shell renders
- **THEN** the application version is shown, taken from the build's version constant
