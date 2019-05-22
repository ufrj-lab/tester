import React, { Fragment, useEffect, useState } from 'react'

import Router from './Router'

import { Query } from 'react-apollo'
import { GET_STATE } from '../graphql/Query'

import GlobalStyle from './_styles'

export default () => {
  const [queryID, setQueryID] = useState(undefined)

  useEffect(() => {
    fetch('/generated/initial.json')
      .then(response => response.json())
      .then(({ id }) => setQueryID(id))
  }, [queryID])

  if (!queryID) return null
  return (
    <Fragment>
      <GlobalStyle />
      <Query query={GET_STATE}>
        {({ data: { state } }) => {
          return <Router state={state} queryID={queryID} />
        }}
      </Query>
    </Fragment>
  )
}
