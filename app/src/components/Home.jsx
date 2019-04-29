import React, { Fragment, useState } from 'react'

import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { Query, Mutation } from 'react-apollo'

import { GET_HOME } from '../graphql/Query'
import { CREATE_TEST_RESULT, UPDATE_STATE } from '../graphql/Mutation'

export default ({ prefixTitle, first = 1, history }) => {
  const [running, toggleRunning] = useState(false)

  return (
    <Query query={GET_HOME} variables={{ first }}>
      {({ loading, error, data: { views } }) => {
        if (loading) return 'loading'
        if (error) return 'error'

        const [{ welcome, company, tests }] = views

        const [{ id }] = tests

        return (
          <Fragment>
            <Helmet>
              <title>{prefixTitle(welcome.title)}</title>
            </Helmet>
            <header>
              <h1>
                {(company.abbr && (
                  <abbr title={company.name}>{company.abbr}</abbr>
                )) ||
                  company.title}
              </h1>
            </header>
            <main>
              <div
                dangerouslySetInnerHTML={{
                  __html: welcome.message,
                }}
              />
              <Mutation mutation={CREATE_TEST_RESULT}>
                {create => (
                  <Mutation mutation={UPDATE_STATE}>
                    {updateState => (
                      <Link
                        to="/teste"
                        onClick={async event => {
                          if (!running) event.preventDefault()
                          else return

                          toggleRunning(true)

                          const href = event.currentTarget.getAttribute('href')

                          const {
                            data: {
                              createTestResult: { id: resultID },
                            },
                          } = await create({
                            variables: {
                              start: new Date(),
                              parent: id,
                            },
                          })
                          await updateState({
                            variables: {
                              test: id,
                              result: resultID,
                            },
                          })

                          history.push(href)
                        }}
                      >
                        Começar
                      </Link>
                    )}
                  </Mutation>
                )}
              </Mutation>
            </main>
          </Fragment>
        )
      }}
    </Query>
  )
}
