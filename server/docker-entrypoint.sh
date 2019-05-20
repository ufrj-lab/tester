#!/bin/bash

if [ -z ${PRISMA_ENDPOINT+x} ]; then echo "Variable PRISMA_ENDPOINT not defined!" && exit 1 ; else prisma deploy --no-generate --skip-hooks --no-seed; fi

node /app/dist/db/seed.js

node /app/dist/index.js
