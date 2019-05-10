import React, { Fragment } from 'react'

import Router from './Router'

import { Query } from 'react-apollo'
import { GET_STATE } from '../graphql/Query'

import GlobalStyle from './_styles'

export default () => (
  <Fragment>
    <GlobalStyle />
    <Query query={GET_STATE}>
      {({ data: { state } }) => {
        console.log(state)
        return <Router state={state} />
      }}
    </Query>
  </Fragment>
)
