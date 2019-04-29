import { render } from 'react-dom'

import Providers from './components/Providers'
import createClient, { data, cache } from './graphql/ApolloClient'

import App from './components/App'

const root = document.querySelector('#root')

const client = createClient()

cache.writeData({ data })

client.onResetStore(() => cache.writeData({ data }))

render(Providers(App, client), root)
