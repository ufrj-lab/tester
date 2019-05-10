import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Home from './Home'
import Tanks from './Tanks'
import Test from './Test'
import NotFound from './NotFound'

import { Query } from 'react-apollo'
import { GET_BASIC } from '../graphql/Query'

import { configPrefix } from '../utils'

export default ({ first = 1, state }) => (
  <Query query={GET_BASIC} variables={{ first }}>
    {({ loading, error, data }) => {
      if (loading) return null
      if (error) return null

      const [{ company }] = data.views

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
              <Home {...props} state={state} prefixTitle={prefixTitle} />
            )}
          />
          <Route
            exact
            path="/teste"
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
