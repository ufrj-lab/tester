import React, { Fragment, useState } from 'react'

import { Link, Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import styled from 'styled-components'

import { Query, Mutation } from 'react-apollo'

import { GET_TEST } from '../graphql/Query'
import {
  CREATE_STEP_RESULT,
  UPDATE_STATE,
  UPDATE_TEST_RESULT,
} from '../graphql/Mutation'

import Menus from './Menus'

import { btnSetStyle, switchColor, variables } from './_styles'

const arraysEqualIds = (a, b) => {
  console.log(a, b)
  if (a === b) return true
  if (a === null || b === null) return false
  if (a.length !== b.length) return false

  for (var i = 0; i < a.length; ++i) {
    if (a[i].id !== b[i].id) return false
  }
  return true
}

const testPath = (userPath, idealPath) => {
  const { paths, targets } = idealPath

  const userTarget = userPath.slice(-1).pop()

  let finalCorrect = false

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i]
    if (target.id === userTarget.id) {
      finalCorrect = true
      break
    }
  }

  if (finalCorrect) {
    for (let i = 0; i < paths.length; i++) {
      const { items: correctPath } = paths[i]
      const isEqual = arraysEqualIds(correctPath, userPath)
      if (isEqual) {
        return 'SUCCESS'
      }
    }
    return 'PARTIAL'
  }

  return 'FAIL'
}

const Btn = ({ mutations, ids, status, hooks, className, tests }) => (
  <Link
    className={className && `${className} --big`}
    to="/test"
    onClick={async event => {
      const { running, timer, next, active, path } = hooks
      if (!running.data && next.data) event.preventDefault()
      else return

      running.set(true)

      const end = new Date()

      const time = end - timer.data

      const statusPath = testPath(path.data, tests)

      const result = {
        variables: {
          start: timer.data,
          end,
          time: time,
          path: path.data,
          result: ids.result,
          parent: ids.parent,
          status: statusPath,
        },
      }

      mutations.createStepResult(result)

      const finish = status.nextCount >= status.length

      if (finish) {
        await mutations.updateTestResult({
          variables: {
            id: ids.result,
            end,
            time: end - new Date(status.startTest),
            status: 'FINISH',
          },
        })
      }

      mutations.updateState({
        variables: {
          finish,
          current: status.nextCount,
        },
      })

      timer.set(new Date())
      next.set(false)
      path.set([])
      active.set(active.init)
      running.set(false)
    }}
  >
    É este!
  </Link>
)

const BtnStyled = btnSetStyle(Btn)

const BackGroundClose = ({ className, hooks }) => {
  const { active } = hooks

  return (
    <a
      className={className}
      href="/test"
      onClick={event => {
        event.preventDefault()
        active.set({
          ...active.data,
          actives: [],
        })
      }}
    >
      Voltar
    </a>
  )
}

const BackGroundCloseStyled = styled(BackGroundClose)`
  background-color: ${switchColor('gray')};
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 0;
  opacity: 0;
  font-size: 0;
  color: transparent;
  display: block;
  pointer-events: none;
  transition: 0.3s;
  ${({ disabled }) =>
    disabled
      ? ''
      : `
    opacity: .9;
    pointer-events: all;
  `}
`
const Main = ({ menus, hooks, btnProps, className, disabled }) => (
  <main className={className}>
    <Menus {...{ menus, hooks }} />
    <BtnStyled center={true} bgColor="success" {...{ ...btnProps }} />
    <BackGroundCloseStyled disabled={disabled} hooks={hooks} />
  </main>
)

const MainStyled = styled(Main)`
  width: 100%;
  padding: 0 5vw 0;
  margin-top: calc(2rem + 5vh);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
`

const Header = ({ current, length, step, className }) => (
  <header className={className}>
    <h1>
      <span>
        Passo{' '}
        <span className="number">
          {current + 1} de {length}
        </span>
        :
      </span>
      {step.question.pt}{' '}
    </h1>
  </header>
)

const HeaderStyled = styled(Header)`
  display: flex;
  width: 100%;
  background-color: ${switchColor('white')};
  box-shadow: ${variables.shadows.base};
  & > h1 {
    flex: 1;
    margin: 0;
    display: flex;
    align-items: center;
    & > span {
      display: flex;
      min-height: 100%;
      box-sizing: border-box;
      font-size: 0;
      color: transparent;
      background-color: ${switchColor('primary')};
      padding: 0.5rem 1rem;
      justify-content: center;
      align-items: center;
      white-space: nowrap;
      margin-right: 2rem;
      & > .number {
        font-size: 2rem;
        color: ${switchColor('white')};
      }
    }
  }
  z-index: 9999;
`

export default ({ prefixTitle, state }) => {
  // console.log('TEST', state)
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

  const {
    test: testID,
    current,
    result: resultID,
    finish,
    pub,
    start: startTest,
  } = state

  if (!testID) return <Redirect to={`/home/${pub}`} />

  if (finish) return <Redirect to="/obrigado" />

  const nextCount = current + 1

  const types = [pub.toUpperCase(), 'ALL'].filter(
    (key, pos, arr) => arr.indexOf(key) === pos,
  )

  return (
    <Mutation mutation={CREATE_STEP_RESULT}>
      {createStepResult => {
        return (
          <Mutation mutation={UPDATE_STATE}>
            {updateState => {
              return (
                <Mutation mutation={UPDATE_TEST_RESULT}>
                  {updateTestResult => {
                    return (
                      <Query
                        query={GET_TEST}
                        variables={{
                          id: testID,
                          types,
                        }}
                      >
                        {({ loading, error, data: { test } }) => {
                          if (loading) return null
                          if (error) return null

                          const {
                            menus,
                            steps,
                            title: { pt: title },
                          } = test

                          const length = steps.length

                          const step = steps[current]

                          const disabled = !nextData

                          const btnProps = {
                            ids: {
                              parent: step.id,
                              result: resultID,
                            },
                            tests: {
                              paths: step.paths,
                              targets: step.targets,
                            },
                            hooks,
                            mutations: {
                              createStepResult,
                              updateState,
                              updateTestResult,
                            },
                            status: {
                              startTest,
                              nextCount,
                              length,
                            },
                            disabled,
                          }

                          return (
                            <Fragment>
                              <Helmet>
                                <title>{prefixTitle(title)}</title>
                              </Helmet>
                              <HeaderStyled
                                current={current}
                                step={step}
                                length={length}
                              />
                              <MainStyled
                                menus={menus}
                                hooks={hooks}
                                btnProps={btnProps}
                                disabled={disabled}
                              />
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
      }}
    </Mutation>
  )
}
