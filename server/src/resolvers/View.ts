import { prismaObjectType } from 'nexus-prisma'
export const View = prismaObjectType({
    name: 'View',
    definition(t) {
        t.prismaFields({ filter: ['testResults', 'stepResults']})
    }
})