import React, { Fragment, useState } from 'react'

import { Link, Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { Query, Mutation } from 'react-apollo'

import { GET_TEST } from '../graphql/Query'
import { CREATE_STEP_RESULT, UPDATE_STATE } from '../graphql/Mutation'

import Menus from './Menus'

import { getTimeSemantic } from '../utils'

export default ({ prefixTitle, state }) => {
  const [running, setRunning] = useState(false)

  const [next, setNext] = useState(false)

  const [timer, setTime] = useState(new Date())

  const [path, setPath] = useState([])

  const initActive = {
    parent: null,
    actives: [],
    last: null,
  }

  const [active, setActive] = useState(initActive)

  const { test: testID, current, result: resultID, finish } = state

  if (!testID) return <Redirect to="/" />

  if (finish) return <Redirect to="/obrigado" />

  const nextCount = current + 1

  console.log('STATE', state)

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
                          <nav>
                            {
                              <Menus
                                menus={menus}
                                next={{ next, setNext }}
                                path={{ path, setPath }}
                                active={{ active, setActive }}
                              />
                            }
                          </nav>
                          <Link
                            className={`btn ${next ? '' : '--disabled'}`}
                            to="/teste"
                            onClick={async event => {
                              if (!running && next) event.preventDefault()
                              else return

                              setRunning(true)

                              const end = new Date()

                              const time = end - timer

                              await create({
                                variables: {
                                  start: timer,
                                  end,
                                  timeInt: time,
                                  timeText: getTimeSemantic(time),
                                  path,
                                  result: resultID,
                                  parent: step.id,
                                },
                              })

                              await updateState({
                                variables: {
                                  finish: nextCount >= length,
                                  current: nextCount,
                                },
                              })

                              setTime(new Date())
                              setRunning(false)
                              setNext(false)
                              setActive(initActive)
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
