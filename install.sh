#!/usr/bin/env bash

deno install -gf --allow-read ./json2tsv.ts
deno install -gf --allow-env --allow-read --allow-sys --allow-net ./lambdaDotenv.ts
deno install -gf --allow-write ./scriptMe.ts
