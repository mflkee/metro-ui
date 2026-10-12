#!/usr/bin/env node
/**
 * The registry's own guard: a dependency that names an item of THIS registry must be
 * namespaced (`@metro/<name>`).
 *
 * A bare name is resolved against ui.shadcn.com, so `npx shadcn add @metro/account-menu`
 * dies with "The item at https://ui.shadcn.com/r/styles/new-york-v4/theme-switcher.json was
 * not found" — and only at the consumer's side, after the item is published.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(readFileSync(path.join(root, "registry.json"), "utf8"));

const names = new Set(registry.items.map((item) => item.name));
const problems = [];

for (const item of registry.items) {
  for (const dep of item.registryDependencies ?? []) {
    if (!names.has(dep)) {
      continue; // a shadcn item (badge, card, …) or an external address
    }
    if (!dep.startsWith("@")) {
      problems.push(
        `${item.name}: registryDependency "${dep}" names an item of this registry — write "@metro/${dep}"; ` +
          "a bare name is looked up on ui.shadcn.com",
      );
    }
  }
}

if (problems.length) {
  console.error(`registry.json: ${problems.length} problem(s):\n`);
  for (const problem of problems) {
    console.error(`  ${problem}`);
  }
  process.exit(1);
}

console.log(`registry.json: ${registry.items.length} items, dependencies are namespaced`);
