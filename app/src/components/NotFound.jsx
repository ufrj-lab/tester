import React, { Fragment } from 'react'

import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import Header from './Header'

import { boxContentSetStyle, btnSetStyle } from './_styles'

const Btn = ({ className }) => (
  <Link className={className} to="/">
    Ir para o inicio
  </Link>
)

const BtnStyled = btnSetStyle(Btn)

const Main = ({ path, className }) => (
  <main className={className}>
    <h2 className="big">404</h2>
    <p>
      Não encontramos <strong className="error">{path}</strong>
    </p>
    <BtnStyled bgColor="primary" />
  </main>
)

const MainStyled = boxContentSetStyle(Main)

export default ({ prefixTitle, match: { params }, company }) => {
  const { path } = params
  return (
    <Fragment>
      <Helmet>
        <title>{prefixTitle(`404: Não encontramos "${path}"`)}</title>
      </Helmet>
      <Header company={company} />
      <MainStyled path={path} />
    </Fragment>
  )
}
