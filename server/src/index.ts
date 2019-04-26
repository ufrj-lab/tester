import { ApolloServer, ServerInfo } from 'apollo-server'
import { prisma } from './generated/prisma-client'
import { IContext, IRequest } from './interfaces'
import { schema } from './schema'

const server = new ApolloServer({
    context: ({ req }: IRequest): IContext => ({
        prisma,
        request: req,
    }),
    schema
})

server.listen().then(({ url }: ServerInfo) =>
  console.log(`🚀 Server ready at ${url}`),
)
