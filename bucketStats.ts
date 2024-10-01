#!/usr/bin/env -S deno run --allow-env --allow-read --allow-sys --allow-net

import {
  ListObjectsCommand,
  ListObjectsCommandOutput,
  S3Client,
} from "npm:@aws-sdk/client-s3";
import { parseArgs } from "@std/cli";

import { Bin, Stats } from "./Stats.ts";

const USAGE = `Get storage size stats from an s3 bucket

Usage:
  bucketStats --bucket <bucket> [--prefix <prefix>] [--sampleSize <sample-size>]
`;

const args = parseArgs(Deno.args, {
  alias: {
    h: "help",
    N: "sampleSize",
  },
});

if (args.help) {
  console.error(USAGE);
  Deno.exit(0);
}

const { bucket, prefix } = args;

if (!bucket) {
  console.error(USAGE);
  Deno.exit(1);
}

const DEFAULT_SAMPLE_SIZE = 100_000;

const sampleSize = args.sampleSize
  ? parseInt(args.sampleSize)
  : DEFAULT_SAMPLE_SIZE;

const client = new S3Client({});

let count = 0;
let Marker: string | undefined = undefined;
const numbers = new Stats();

do {
  const remaining = sampleSize - count;
  const MaxKeys = Math.min(1000, remaining);

  const resp: ListObjectsCommandOutput = await client.send(
    new ListObjectsCommand({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys,
      Marker,
    }),
  );

  const len = resp?.Contents?.length || 0;
  if (len === 0) break;

  resp.Contents?.forEach((item) => {
    numbers.push(item.Size!);
  });

  Marker = resp?.Contents?.[len - 1]?.Key;
  count += len;
} while (count <= sampleSize);

const bins = [
  new Bin(2 ** 13), // 8KB
  new Bin(2 ** 14),
  new Bin(2 ** 15),
  new Bin(2 ** 16),
  new Bin(2 ** 17),
  new Bin(2 ** 18),
  new Bin(Infinity),
];

console.log(`Max: ${numbers.max}`);
console.log(`Min: ${numbers.min}`);
console.log(`Mean: ${numbers.mean}`);
console.log(`Median: ${numbers.median}`);

const histogram = numbers.histogram(bins);
let prevBin: Bin | undefined = undefined;
console.log("\nDistribution:");
for (const bin of histogram) {
  const min = prevBin ? prevBin.max : 0;
  const max = bin.max;
  console.log(`${min} - ${max}: ${bin.count}`);
  prevBin = bin;
}
