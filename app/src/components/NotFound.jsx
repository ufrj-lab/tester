import React, { Fragment } from 'react'

import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

export default ({ prefixTitle, match: { params } }) => {
  const { path } = params
  return (
    <Fragment>
      <Helmet>
        <title>{prefixTitle(`404: Não encontramos "${path}"`)}</title>
      </Helmet>
      <header>
        <h1>404</h1>
      </header>
      <main>
        <h2>
          Não encontramos "<strong>{path}</strong>"
        </h2>
        <Link to="/">Ir para o inicio</Link>
      </main>
    </Fragment>
  )
}
