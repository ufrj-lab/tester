import React, { Fragment } from 'react'

import { Link, Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { Query } from 'react-apollo'

import { GET_TEST, GET_STATE } from '../graphql/Query'
// import { CREATE_STEP_RESULT } from '../graphql/Mutation'

import Menus from './Menus'

export default ({ prefixTitle }) => (
  <Query query={GET_STATE}>
    {({ data }) => {
      const { test: id } = data.state

      if (!id) return <Redirect to="/" />

      return (
        <Query query={GET_TEST} variables={{ id }}>
          {({ loading, error, data: { test } }) => {
            if (loading) return null
            if (error) return null

            const { menus, title } = test

            return (
              //         <Mutation mutation={CREATE_STEP_RESULT} variables={{}}>
              //           {run => {
              //             run()
              //             return (
              <Fragment>
                <Helmet>
                  <title>{prefixTitle(title)}</title>
                </Helmet>
                <header />
                <main>
                  <nav>
                    <Menus menus={menus} />
                  </nav>
                  <Link to="/">Proximo</Link>
                </main>
              </Fragment>
            )
            //          }}
            //        </Mutation>
            //      )
          }}
        </Query>
      )
    }}
  </Query>
)
