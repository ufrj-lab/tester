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
  id,
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
            to="/teste"
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
                  parent: id,
                  status: 'ABORTED',
                },
              })
              await updateState({
                variables: {
                  start: new Date(),
                  test: id,
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
  id,
  className,
  title,
  params,
}) => (
  <main className={className}>
    <h2>{title}</h2>
    <div
      dangerouslySetInnerHTML={{
        __html: welcome.message,
      }}
    />
    <BtnStyled
      bgColor="success"
      {...{ history, running, setRunning, id, params }}
    >
      Vamos começar!
    </BtnStyled>
  </main>
)

const MainStyled = boxContentSetStyle(Main)

const Home = ({
  prefixTitle,
  first = 1,
  history,
  state,
  match: { params },
}) => {
  const { finish } = state
  const [running, setRunning] = useState(false)

  if (finish) return <Redirect to="/obrigado" />

  return (
    <Query query={GET_HOME} variables={{ first }}>
      {({ loading, error, data: { views } }) => {
        if (loading) return null
        if (error) return null

        const [{ welcome, company, tests }] = views

        const [{ id, title }] = tests

        return (
          <Fragment>
            <Helmet>
              <title>{prefixTitle(welcome.title)}</title>
            </Helmet>
            <HeaderStyled {...{ company }} />
            <MainStyled
              {...{ id, running, setRunning, history, welcome, title, params }}
            />
          </Fragment>
        )
      }}
    </Query>
  )
}

export default Home
