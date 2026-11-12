#!/bin/bash
set -e
cd "$(dirname "$0")/.."
mise run dev --port 4321
