import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache } from 'apollo-cache-persist'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'

import typeDefs from './typeDefs'
import resolvers from './resolvers'

export const cache = new InMemoryCache()

persistCache({
   cache,
   storage: window.localStorage,
})

export const data = {
   state: {
      __typename: 'State',
      start: null,
      test: null,
      result: null,
      path: [],
      finish: false,
      current: 0,
      pub: 'all',
   },
}

export default (uri = 'http://localhost:4000') =>
   new ApolloClient({
      link: ApolloLink.from([
         onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
               graphQLErrors.map(({ message, locations, path }) =>
                  console.error(
                     `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                  ),
               )
            if (networkError) console.error(`[Network error]: ${networkError}`)
         }),
         new HttpLink({
            uri,
            credentials: 'same-origin',
         }),
      ]),
      cache,
      typeDefs,
      resolvers,
   })
