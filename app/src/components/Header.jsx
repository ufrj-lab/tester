import React from 'react'
import styled from 'styled-components'

const Header = ({ company, className }) => (
  <header className={className}>
    <h1>
      {(company.abbr && <abbr title={company.name}>{company.abbr}</abbr>) ||
        company.title}
    </h1>
  </header>
)

export default styled(Header)`
  padding: 0.5em 1em;
  display: flex;
  align-items: center;
  h1 {
    margin: 0;
    abbr {
      text-decoration: none;
    }
  }
`
