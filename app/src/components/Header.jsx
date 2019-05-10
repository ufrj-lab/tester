import React from 'react'
import styled from 'styled-components'
import { switchColor } from './_styles'

import { ReactComponent as Logo } from './logo.svg'

const Header = ({ company, className }) => (
  <header className={className}>
    <Logo />
    <h1>
      {(company.abbr && <abbr title={company.name}>{company.abbr}</abbr>) ||
        company.title}
    </h1>
  </header>
)

export default styled(Header)`
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  color: ${switchColor('primary')};
  box-sizing: border-box;
  position: sticky;
  top: 0;
  font-size: 2rem;
  width: 100vw;
  svg {
    display: flex;
    align-self: flex-start;
    max-height: 3em;
  }
  h1 {
    margin: 0 0.25rem;
    font-size: 1.2em;
    abbr {
      text-decoration: none;
    }
  }
`
