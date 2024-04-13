#!/usr/bin/env -S deno run --allow-write

import { parseArgs } from "./deps.ts";

const USAGE = `Generate basic scaffolding for Deno or TypeScript scripts.

If --output is not provided, the script will be written to stdout.

Usage:
  scriptMe [--typescript] [--output <file>]
`;

const args = parseArgs(Deno.args, {
  alias: {
    h: "help",
    o: "output",
    ts: "typescript",
  },
});

if (args.help) {
  console.error(USAGE);
  Deno.exit(0);
}

const DenoTemplate = `#!/usr/bin/env -S deno run -A

console.log("Hello world!");`;

const TSTemplate = `#!/usr/bin/env -S tsx -r dotenv/config

async function main(): Promise<void> {
  console.log("Hello world!");
}

main();`;

const script = args.typescript ? TSTemplate : DenoTemplate;

if (args.output) {
  await Deno.writeTextFile(args.output, script);
  await Deno.chmod(args.output, 0o755);
} else {
  console.log(script);
}
