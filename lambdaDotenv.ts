#!/usr/bin/env -S deno run --allow-env --allow-read --allow-sys --allow-net

import {
  GetFunctionConfigurationCommand,
  LambdaClient,
} from "@aws-sdk/client-lambda";
import { parseArgs } from "@std/cli";

const USAGE =
  `Get environment variables for a Lambda function and output them in dotenv format.

Usage:
  lambdaDotenv <functionName>

Example:
  lambdaDotenv my-function > .env
`;

const args = parseArgs(Deno.args, {
  alias: {
    h: "help",
  },
  string: ["_"],
});

if (args.help) {
  console.error(USAGE);
  Deno.exit(0);
}

const functionName = args._[0];
if (!functionName) {
  console.error("Usage: lambdaDotenv <functionName>");
  Deno.exit(1);
}

const client = new LambdaClient();

const resp = await client.send(
  new GetFunctionConfigurationCommand({
    FunctionName: functionName,
  }),
);

const vars = Object.entries(resp.Environment?.Variables || {});
if (vars.length === 0) {
  console.error(`No environment variables for ${functionName}`);
  Deno.exit(0);
}

vars.forEach(([key, value]) => {
  try {
    // support JSON encoded values
    const parsed = JSON.parse(value);
    console.log(`${key}='${JSON.stringify(parsed)}'`);
  } catch (_) {
    console.log(`${key}=${JSON.stringify(value)}`);
  }
});
