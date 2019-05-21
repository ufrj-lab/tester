const { PRISMA_ENDPOINT } = process.env

if (!PRISMA_ENDPOINT) {
  process.env.PRISMA_ENDPOINT = 'http://localhost:4466'
}

import { ApolloServer, ServerInfo } from 'apollo-server'
import { prisma } from './src/generated/prisma-client'
import { IContext, IRequest } from './src/interfaces'
import { schema } from './src/schema'

const server = new ApolloServer({
  context: ({ req }: IRequest): IContext => ({
    prisma,
    request: req,
  }),
  schema,
})

server
  .listen()

  .then(({ url }: ServerInfo) => {
    // tslint:disable-next-line: no-console
    console.log(`🚀 Server ready at ${url}`)
    // tslint:disable-next-line: no-console
    console.log(
      `Try your health check at: ${url}.well-known/apollo/server-health`,
    )
  })
