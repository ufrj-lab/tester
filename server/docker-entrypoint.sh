#!/bin/bash

prisma deploy --no-generate --skip-hooks

node /app/dist/db/seed.js

node /app/dist/index.js
