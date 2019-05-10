import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'

import { boxContentSetStyle, btnSetStyle } from './_styles'

import HeaderStyled from './Header'

const Btn = ({ company, className }) =>
  company.abbr ? (
    <a className={className} href="https://ufrj.br">
      Ir para o portal da <abbr title={company.name}>{company.abbr}</abbr>
    </a>
  ) : (
    <a className={className} href="https://ufrj.br">
      Ir para o portal da {company.name}
    </a>
  )

const BtnStyled = btnSetStyle(Btn)

const Main = ({ company, className }) => (
  <main className={className}>
    <h2>Obrigado</h2>
    <p>
      Teste concluído! Obrigado mais uma vez pela sua participação. Seu{' '}
      <i>feedback</i> será muito útil nos ajudando a organizar o conteúdo do
      novo portal da UFRJ e facilitar sua usabilidade.
    </p>
    <BtnStyled bgColor="success" company={company} />
  </main>
)

const MainStyled = boxContentSetStyle(Main)

export default ({ prefixTitle, state: { finish }, company }) => {
  if (!finish) return <Redirect to="/" />

  return (
    <Fragment>
      <Helmet>
        <title>{prefixTitle('Obrigado!')}</title>
      </Helmet>
      <HeaderStyled company={company} />
      <MainStyled company={company} />
    </Fragment>
  )
}
