import { Prisma } from './generated/prisma-client'
import { IncomingMessage } from 'http'

export interface IRequest {
    req: IncomingMessage
}

export interface IContext {
    prisma: Prisma
    request: IncomingMessage
}
