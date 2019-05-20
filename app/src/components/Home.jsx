import React, { Fragment, useState } from 'react'

import { btnSetStyle, boxContentSetStyle } from './_styles'

import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'

import { Query, Mutation } from 'react-apollo'

import { GET_HOME } from '../graphql/Query'
import { CREATE_TEST_RESULT, UPDATE_STATE } from '../graphql/Mutation'

import HeaderStyled from './Header'

const Btn = ({
  running,
  setRunning,
  testID,
  history,
  className,
  children,
  params,
}) => (
  <Mutation mutation={CREATE_TEST_RESULT}>
    {create => (
      <Mutation mutation={UPDATE_STATE}>
        {updateState => (
          <Link
            className={className}
            to="/test"
            onClick={async event => {
              if (!running) event.preventDefault()
              else return

              setRunning(true)

              const href = event.currentTarget.getAttribute('href')

              const {
                data: {
                  createTestResult: { id: resultID },
                },
              } = await create({
                variables: {
                  start: new Date(),
                  parent: testID,
                  status: 'ABORTED',
                },
              })
              await updateState({
                variables: {
                  start: new Date(),
                  test: testID,
                  result: resultID,
                  pub: params.public,
                },
              })

              history.push(href)
            }}
          >
            {children}
          </Link>
        )}
      </Mutation>
    )}
  </Mutation>
)

const BtnStyled = btnSetStyle(Btn)

const Main = ({
  welcome,
  history,
  running,
  setRunning,
  testID,
  className,
  params,
}) => (
  <main className={className}>
    <h2>{welcome.title}</h2>
    <div
      dangerouslySetInnerHTML={{
        __html: welcome.message,
      }}
    />
    <BtnStyled
      bgColor="success"
      {...{ history, running, setRunning, testID, params }}
    >
      Vamos começar!
    </BtnStyled>
  </main>
)

const MainStyled = boxContentSetStyle(Main)

const Home = ({ prefixTitle, queryID, history, state, match: { params } }) => {
  console.log('HOME', state)
  const { finish, result } = state
  const [running, setRunning] = useState(false)

  if (result) return <Redirect to="/test" />

  if (finish) return <Redirect to="/obrigado" />

  return (
    <Query query={GET_HOME} variables={{ id: queryID }}>
      {({ loading, error, data: { test } }) => {
        if (loading) return null
        if (error) return null
        const {
          company,
          instruction,
          title: { pt: title },
        } = test

        const {
          message: { pt: message },
        } = instruction

        const welcome = { title, message }

        return (
          <Fragment>
            <Helmet>
              <title>{prefixTitle(title)}</title>
            </Helmet>
            <HeaderStyled {...{ company }} />
            <MainStyled
              {...{
                testID: queryID,
                welcome,
                running,
                setRunning,
                history,
                params,
              }}
            />
          </Fragment>
        )
      }}
    </Query>
  )
}

export default Home
