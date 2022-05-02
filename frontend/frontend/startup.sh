#!/usr/bin/env bash
export NODE_OPTIONS="--max-old-space-size=512"
npm run build
npm run start