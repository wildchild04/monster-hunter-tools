#!/usr/bin/env bash
set -euo pipefail
pushd gleam-js/mh_tools >/dev/null
gleam build
pushd bundling >/dev/null
npm ci
npm run build
popd >/dev/null
popd >/dev/null
echo "Built -> assets/mh-tools.js"

