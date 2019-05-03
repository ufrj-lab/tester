import React, { Fragment, useState } from 'react'

import { Link, Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { Query, Mutation } from 'react-apollo'

import { GET_TEST } from '../graphql/Query'
import { CREATE_STEP_RESULT, UPDATE_STATE } from '../graphql/Mutation'

import Menus from './Menus'

import { btnSetStyle } from './_styles'

import { getTimeSemantic } from '../utils'

const Btn = ({ mutations, ids, status, hooks, className }) => (
  <Link
    className={className}
    to="/teste"
    onClick={async event => {
      const { running, timer, next, active, path } = hooks
      if (!running.data && next.data) event.preventDefault()
      else return

      running.set(true)

      const end = new Date()

      const time = end - timer.data

      const result = {
        variables: {
          start: timer.data,
          end,
          timeInt: time,
          timeText: getTimeSemantic(time),
          path: path.data,
          result: ids.result,
          parent: ids.parent,
        },
      }
      console.log('RESULT', result)
      await mutations.create(result)

      await mutations.updateState({
        variables: {
          finish: status.nextCount >= status.length,
          current: status.nextCount,
        },
      })

      timer.set(new Date())
      running.set(false)
      next.set(false)
      active.set(active.init)
    }}
  >
    Proximo
  </Link>
)

const BtnStyled = btnSetStyle(Btn)

export default ({ prefixTitle, state }) => {
  const [runningData, setRunning] = useState(false)

  const [nextData, setNext] = useState(false)

  const [timerData, setTimer] = useState(new Date())

  const [pathData, setPath] = useState([])

  const initActiveData = {
    parent: null,
    actives: [],
    last: null,
  }

  const [activeData, setActive] = useState(initActiveData)

  const hooks = {
    running: {
      data: runningData,
      set: setRunning,
    },
    next: {
      data: nextData,
      set: setNext,
    },
    timer: {
      data: timerData,
      set: setTimer,
    },
    path: {
      data: pathData,
      set: setPath,
    },
    active: {
      init: initActiveData,
      data: activeData,
      set: setActive,
    },
  }

  const { test: testID, current, result: resultID, finish } = state

  if (!testID) return <Redirect to="/" />

  if (finish) return <Redirect to="/obrigado" />

  const nextCount = current + 1

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

                    const btnProps = {
                      ids: {
                        parent: step.id,
                        result: resultID,
                      },
                      hooks,
                      mutations: {
                        create,
                        updateState,
                      },
                      status: {
                        nextCount,
                        length,
                      },
                      disabled: !nextData,
                    }

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
                            <Menus {...{ menus, hooks }} />
                          </nav>
                          <BtnStyled {...{ ...btnProps }} />
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
