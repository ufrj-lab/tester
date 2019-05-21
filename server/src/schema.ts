import { makePrismaSchema } from 'nexus-prisma'
import { join } from 'path'
import datamodelInfo from './generated/nexus-prisma'
import { prisma } from './generated/prisma-client'
import * as allTypes from './resolvers'

export const schema = makePrismaSchema({
  types: allTypes,

  prisma: {
    client: prisma,
    datamodelInfo,
  },

  outputs: {
    schema: join(__dirname, './generated/schema.graphql'),
    typegen: join(__dirname, './generated/nexus.ts'),
  },

  nonNullDefaults: {
    input: true,
    output: true,
  },

  typegenAutoConfig: {
    contextType: 'interfaces.IContext',
    sources: [
      {
        alias: 'interfaces',
        source: join(__dirname, './interfaces.ts'),
      },
    ],
  },

  prettierConfig: {
    arrowParens: 'avoid',
    bracketSpacing: true,
    printWidth: 80,
    proseWrap: 'always',
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
  },
})
