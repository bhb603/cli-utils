#!/usr/bin/env -S deno run

import { parseArgs, TextLineStream } from "./deps.ts";

const USAGE = `Convert JSON to TSV format.
Example:
  cat file.json | json2tsv
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

const jsonToTSVStream = new WritableStream({
  write(chunk) {
    try {
      const obj = JSON.parse(chunk);
      const tsv: string[] = [];
      Object.values(obj).forEach((value) => {
        tsv.push(JSON.stringify(value));
      });
      console.log(tsv.join("\t"));
    } catch (error) {
      console.error(error.message);
    }
  },
});

Deno.stdin.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new TextLineStream())
  .pipeTo(jsonToTSVStream);
