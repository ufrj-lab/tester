import { ApolloServer, ServerInfo } from 'apollo-server'
import { seedingDataBase } from './db/seed'
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
   // tslint:disable-next-line: no-console
   .then(({ url }: ServerInfo) => console.log(`🚀 Server ready at ${url}`))
