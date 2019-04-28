import React from 'react'

import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'

export default (Component, ApolloClient) => (
  <BrowserRouter>
    <ApolloProvider client={ApolloClient}>
      <Component />
    </ApolloProvider>
  </BrowserRouter>
)
