import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Home from './Home'
import Tanks from './Tanks'
import Test from './Test'
import NotFound from './NotFound'

import { Query } from 'react-apollo'

import { GET_HOME } from '../graphql/Query'

import { configPrefix } from '../utils'

export default ({ state }) => {
  const [queryID, setQueryID] = useState(undefined)

  useEffect(() => {
    fetch('/initial.json')
      .then(response => response.json())
      .then(({ id }) => setQueryID(id))
  }, [queryID])

  if (!queryID) return null
  return (
    <Query query={GET_HOME} variables={{ id: queryID }}>
      {({ loading, error, data }) => {
        if (loading) return null
        if (error) return null
        console.log('ROUTER', state)
        const { company } = data.test

        const { abbr, name } = company

        const prefixTitle = configPrefix(`${abbr || name} | `)

        return (
          <Switch>
            <Route exact path="/">
              <Redirect to="/home/all" />
            </Route>
            <Route
              exact
              path="/home/:public"
              render={props => (
                <Home
                  {...props}
                  state={state}
                  queryID={queryID}
                  prefixTitle={prefixTitle}
                />
              )}
            />
            <Route
              exact
              path="/test"
              render={props => (
                <Test {...props} state={state} prefixTitle={prefixTitle} />
              )}
            />
            <Route
              exact
              path="/obrigado"
              render={props => (
                <Tanks
                  {...props}
                  company={company}
                  state={state}
                  prefixTitle={prefixTitle}
                />
              )}
            />
            <Route
              path="/:path"
              render={props => (
                <NotFound
                  {...props}
                  company={company}
                  state={state}
                  prefixTitle={prefixTitle}
                />
              )}
            />
          </Switch>
        )
      }}
    </Query>
  )
}
