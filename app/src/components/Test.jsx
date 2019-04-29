import React, { Fragment, useState } from 'react'

import { Link, Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { Query, Mutation } from 'react-apollo'

import { GET_TEST } from '../graphql/Query'
import { CREATE_STEP_RESULT, UPDATE_STATE } from '../graphql/Mutation'

import Menus from './Menus'

import { getTimeSemantic } from '../utils'

export default ({ prefixTitle, state }) => {
  const [running, toggleRunning] = useState(false)

  const [next, toggleNext] = useState(false)

  const [timer, setTime] = useState(new Date())

  const { test: testID, current, result: resultID } = state

  if (!testID) return <Redirect to="/" />

  return (
    <Mutation mutation={CREATE_STEP_RESULT}>
      {create => {
        return (
          <Mutation mutation={UPDATE_STATE}>
            {updateState => {
              return (
                <Query query={GET_TEST} variables={{ id: testID }}>
                  {({ loading, error, data: { test } }) => {
                    if (loading) return null
                    if (error) return null

                    const { menus, title, steps } = test

                    const length = steps.length

                    if (current + 1 > length) return <Redirect to="/obrigado" />

                    const step = steps[current]

                    return (
                      <Fragment>
                        <Helmet>
                          <title>{prefixTitle(title)}</title>
                        </Helmet>
                        <header>
                          <h1>
                            Passo {current + 1} de {length}: {step.question}
                          </h1>
                        </header>
                        <main>
                          <nav>{/*<Menus menus={menus} />*/}</nav>
                          <Link
                            to="/teste"
                            onClick={async event => {
                              if (!running) event.preventDefault()
                              else return

                              toggleRunning(true)

                              const end = new Date()

                              const time = end - timer

                              const data = await create({
                                variables: {
                                  start: timer,
                                  end,
                                  timeInt: time,
                                  timeText: getTimeSemantic(time),
                                  result: resultID,
                                  parent: step.id,
                                },
                              })

                              console.log(data)

                              await updateState({
                                variables: {
                                  current: current + 1,
                                },
                              })

                              setTime(new Date())
                              toggleRunning(false)
                            }}
                          >
                            Proximo
                          </Link>
                        </main>
                      </Fragment>
                    )
                  }}
                </Query>
              )
            }}
          </Mutation>
        )
      }}
    </Mutation>
  )
}
