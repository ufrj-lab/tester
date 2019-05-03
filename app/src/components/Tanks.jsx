import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'

import HeaderStyled from './Header'

export default ({ prefixTitle, state: { finish }, company }) => {
  // if (!finish) return <Redirect to="/" />
  console.log(company)
  return (
    <Fragment>
      <Helmet>
        <title>{prefixTitle('Obrigado!')}</title>
      </Helmet>
      <HeaderStyled company={company} />
      <main>
        <h2>Obrigado</h2>
        <p>Você ajudou muito</p>
        {company.abbr ? (
          <a href="https://ufrj.br">
            Ir para o portal da <abbr title={company.name}>{company.abbr}</abbr>
          </a>
        ) : (
          <a href="https://ufrj.br">Ir para o portal da {company.name}</a>
        )}
      </main>
    </Fragment>
  )
}
