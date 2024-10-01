#!/usr/bin/env -S deno run --allow-read

import { parseArgs } from "@std/cli";
import { TextLineStream } from "@std/streams";

const USAGE = `Convert JSON to TSV format.
Input can be either a file or stdin

Usage:
  json2tsv [--input <file>]

Example:
  cat file.json | json2tsv

  json2tsv --input data.json
`;

const args = parseArgs(Deno.args, {
  alias: {
    h: "help",
    i: "input",
  },
});

if (args.help) {
  console.error(USAGE);
  Deno.exit(0);
}

const input = args.input ? await Deno.open(args.input) : Deno.stdin;

const lineStream = input.readable
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(new TextLineStream());

for await (const line of lineStream) {
  try {
    const obj = JSON.parse(line);
    const tsv: string[] = [];
    Object.values(obj).forEach((value) => {
      tsv.push(JSON.stringify(value));
    });
    console.log(tsv.join("\t"));
  } catch (error) {
    console.error(error.message);
  }
}
