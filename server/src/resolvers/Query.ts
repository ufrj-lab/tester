import { prismaObjectType } from 'nexus-prisma'
export const Query = prismaObjectType({
   name: 'Query',
   definition(t) {
      t.prismaFields([
         'views',
         { name: 'testResults', alias: 'results' },
         'test',
      ])
   },
})
