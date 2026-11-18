import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const uiDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "components", "ui");

const components = readdirSync(uiDir).filter(
  (file) => file.endsWith(".tsx") && !file.endsWith(".stories.tsx"),
);

const missing = components.filter(
  (file) => !existsSync(join(uiDir, file.replace(/\.tsx$/, ".stories.tsx"))),
);

if (missing.length > 0) {
  console.error("Base components without a Storybook story:");
  for (const file of missing) console.error(`  src/components/ui/${file}`);
  process.exit(1);
}

console.log(`Storybook check passed: ${components.length} base components have stories.`);
