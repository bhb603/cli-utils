import { assertStrictEquals } from "@std/assert/assert-strict-equals";

import { Bin, Stats } from "./Stats.ts";

const NUMBERS = [
  52,
  -98,
  -53,
  -56,
  70,
  -45,
  -87,
  -92,
  25,
  -97,
  70,
  94,
  -23,
  5,
  57,
  11,
  -25,
  9,
  -32,
  -30,
  98,
  -30,
  -18,
  -90,
  82,
];

Deno.test("Stats with no numbers", () => {
  const stats = new Stats();
  assertStrictEquals(stats.size, 0, "size");
  assertStrictEquals(stats.min, NaN, "min");
  assertStrictEquals(stats.max, NaN, "max");
  assertStrictEquals(stats.mean, NaN, "mean");
  assertStrictEquals(stats.median, NaN, "median");
});

Deno.test("Stats with one number", () => {
  const stats = new Stats().push(1);
  assertStrictEquals(stats.size, 1, "size");
  assertStrictEquals(stats.min, 1, "min");
  assertStrictEquals(stats.max, 1, "max");
  assertStrictEquals(stats.mean, 1, "mean");
  assertStrictEquals(stats.median, 1, "median");
});

Deno.test("Stats with two numbers", () => {
  const stats = new Stats().push(1).push(2);
  assertStrictEquals(stats.size, 2, "size");
  assertStrictEquals(stats.min, 1, "min");
  assertStrictEquals(stats.max, 2, "max");
  assertStrictEquals(stats.mean, 1.5, "mean");
  assertStrictEquals(stats.median, 1.5, "median");
});

Deno.test("Stats with many numbers", () => {
  const stats = new Stats();
  NUMBERS.forEach((num) => {
    stats.push(num);
  });

  assertStrictEquals(stats.size, 25, "size");
  assertStrictEquals(stats.min, -98, "min");
  assertStrictEquals(stats.max, 98, "max");
  assertStrictEquals(stats.mean, -8.12, "mean");
  assertStrictEquals(stats.median, -23, "median");
});

Deno.test("Stats histogram", () => {
  const stats = new Stats();
  NUMBERS.forEach((num) => {
    stats.push(num);
  });

  const bins = [
    new Bin(-60),
    new Bin(-20),
    new Bin(20),
    new Bin(60),
    new Bin(Infinity),
  ];

  stats.histogram(bins);

  assertStrictEquals(bins[0].count, 5, "bin 0 count");
  assertStrictEquals(bins[1].count, 8, "bin 1 count");
  assertStrictEquals(bins[2].count, 4, "bin 2 count");
  assertStrictEquals(bins[3].count, 3, "bin 3 count");
  assertStrictEquals(bins[4].count, 5, "bin 4 count");
});
