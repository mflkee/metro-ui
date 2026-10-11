# Spec Delta

## Purpose

Defines the owner's account console (the metroAccounts front end) in terms of the
shared design system, so managing accounts looks like the rest of the fleet.

## ADDED Requirements

### Requirement: The console uses the shared design system

The account console SHALL be built from the shared theme, shell and primitives. It
SHALL NOT carry its own palette or its own controls.

#### Scenario: Opening the console
- **WHEN** the owner signs in
- **THEN** the console renders inside the shared shell, with the shared sidebar, header, controls and colours

#### Scenario: Theme follows the fleet
- **WHEN** the owner switches the theme
- **THEN** the console changes exactly like the other services

### Requirement: Employee list with per-service access

The console SHALL list every account with its name, email and, for each service, an
access switch and the role, plus the last sign-in time and the account state.

#### Scenario: Reading the list
- **WHEN** the owner opens the console
- **THEN** each row shows the employee, the access state of metroLog, metroGen and metroCheck, the role where the service has roles, the last sign-in and the active state

#### Scenario: Granting a service
- **WHEN** the owner turns on a service for an employee
- **THEN** the flag is saved and the employee can sign in to that service with the same password

#### Scenario: Searching
- **WHEN** the owner types a name or an email
- **THEN** the list is filtered to the matching accounts

### Requirement: Creating an employee sends an invitation

Creating an employee SHALL register the account and send a one-time link by email;
the console SHALL NOT display or accept a password.

#### Scenario: Creating an employee
- **WHEN** the owner submits the create form
- **THEN** the account appears in the list and the console reports that an invitation was sent

#### Scenario: No administrator-set password
- **WHEN** any action in the console completes
- **THEN** no password is shown, requested or stored by the console

### Requirement: Invitation and reset pages

The one-time link pages SHALL use the shared design system and SHALL let the person
set their own password.

#### Scenario: Following an invitation
- **WHEN** a person opens an invitation link
- **THEN** a shared-style page asks for the new password twice and confirms that it was set

#### Scenario: An expired link
- **WHEN** the link is unknown or already used
- **THEN** the page says so in the shared style and points back to sign-in
