#!/usr/bin/env -S deno run --allow-write --allow-read

import { parseArgs } from "@std/cli";
import { join } from "@std/path";

const USAGE = `Initilize Zed project settings for Deno.

Writes ./zed/settings.json in the CWD.

Usage:
  initDenoForZed
`;

const args = parseArgs(Deno.args, {
  alias: {
    h: "help",
  },
});

if (args.help) {
  console.error(USAGE);
  Deno.exit(0);
}

// from https://zed.dev/docs/languages/deno#deno-configuration
const denoZedSettings = {
  "lsp": {
    "deno": {
      "settings": {
        "deno": {
          "enable": true,
        },
      },
    },
  },
  "languages": {
    "TypeScript": {
      "language_servers": [
        "deno",
        "!typescript-language-server",
        "!vtsls",
        "!eslint",
      ],
      "formatter": "language_server",
    },
    "TSX": {
      "language_servers": [
        "deno",
        "!typescript-language-server",
        "!vtsls",
        "!eslint",
      ],
      "formatter": "language_server",
    },
  },
};

const curDir = Deno.cwd();
const zedDir = join(curDir, ".zed");
const zedSettingsDir = join(zedDir, "settings.json");

Deno.mkdirSync(zedDir, { recursive: true });

// file exists?
const existingFiles = Deno.readDirSync(zedDir);
for (const f of existingFiles) {
  if (f.name === "settings.json") {
    const proceed = prompt(
      `${zedSettingsDir} already exists. Overwrite? [y/n]`,
    );
    if (
      !proceed ||
      ["y", "yes"].filter((v) => proceed.trim().toLowerCase() === v).length ===
        0
    ) {
      Deno.exit(0);
    }
  }
}

console.log(`Writing ${zedSettingsDir}`);

Deno.writeTextFileSync(
  zedSettingsDir,
  JSON.stringify(denoZedSettings, null, 2) + "\n",
);
