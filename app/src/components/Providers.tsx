import React, { FC } from 'react'

import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'

export default (Component: FC, ApolloClient: any) => 
    <BrowserRouter>
        <ApolloProvider client={ApolloClient}>
                <Component />
        </ApolloProvider>
    </BrowserRouter>
