import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'

export default ({ prefixTitle, state: { finish } }) => {
  if (!finish) return <Redirect to="/" />
  return (
    <Fragment>
      <Helmet>
        <title>{prefixTitle('Obrigado!')}</title>
      </Helmet>
      <header>
        <h1>Obrigado!</h1>
      </header>
      <main>
        <p>Você ajudou muito</p>
        <a href="https://ufrj.br">
          Ir para o portal da <abbr>UFRJ</abbr>
        </a>
      </main>
    </Fragment>
  )
}
