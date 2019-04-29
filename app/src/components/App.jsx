import React from 'react'

import Router from './Router'

import { Query } from 'react-apollo'
import { GET_STATE } from '../graphql/Query'

export default () => (
  <Query query={GET_STATE}>
    {({ data: { state } }) => <Router state={state} />}
  </Query>
)
