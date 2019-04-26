import { render } from 'react-dom'

import Providers from './components/Providers'
import createClient from './graphql/ApolloClient'

import App from './components/App'

const root = document.querySelector('#root')

render(
  Providers(
    App,
    createClient()
  ),
  root
)


