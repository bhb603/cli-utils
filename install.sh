#!/usr/bin/env bash

deno install -gf --allow-env --allow-read --allow-sys --allow-net -c deno.json ./bucketStats.ts
deno install -gf --allow-write --allow-read -c deno.json ./initDenoForZed.ts
deno install -gf --allow-read -c deno.json ./json2tsv.ts
deno install -gf --allow-env --allow-read --allow-sys --allow-net -c deno.json ./lambdaDotenv.ts
deno install -gf --allow-write -c deno.json ./scriptMe.ts
