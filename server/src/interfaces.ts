import { IncomingMessage } from 'http'
import { Prisma } from './generated/prisma-client'

export interface IRequest {
   req: IncomingMessage
}

export interface IContext {
   prisma: Prisma
   request: IncomingMessage
}
