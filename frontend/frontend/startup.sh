#!/usr/bin/env bash
export NODE_OPTIONS="--max-old-space-size=1024"
npm run build
npm run start