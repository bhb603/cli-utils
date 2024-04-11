#!/usr/bin/env bash

deno install -f ./json2tsv.ts
deno install -f --allow-env --allow-read --allow-sys --allow-net ./lambdaDotenv.ts
