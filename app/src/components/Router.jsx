import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './Home'
import Test from './Test'
import NotFound from './NotFound'

import { Query } from 'react-apollo'
import { GET_BASIC } from '../graphql/Query'

import { configPrefix } from '../utils'

export default ({ first = 1 }) => (
  <Query query={GET_BASIC} variables={{ first }}>
    {({ loading, error, data }) => {
      if (loading) return null
      if (error) return null

      console.log('BASIC', data)

      const [{ company }] = data.views

      const { abbr, name } = company

      const prefixTitle = configPrefix(`${abbr || name} | `)

      return (
        <Switch>
          <Route exact path="/">
            <Home prefixTitle={prefixTitle} />
          </Route>
          <Route
            exact
            path="/teste"
            render={props => <Test {...props} prefixTitle={prefixTitle} />}
          />
          <Route exact path="/obrigado">
            <Home prefixTitle={prefixTitle} />
          </Route>
          <Route
            path="/:path"
            render={props => <NotFound {...props} prefixTitle={prefixTitle} />}
          />
        </Switch>
      )
    }}
  </Query>
)
