import { GET_STATE } from './Query'

export default {
  Mutation: {
    updateState: (_, variables, { cache }) => {
      const { state: oldState } = cache.readQuery({ query: GET_STATE })

      const newState = {}
      Object.keys(variables).forEach(key => {
        const value = variables[key]
        if (value) newState[key] = value
      })

      const data = {
        state: {
          ...oldState,
          ...newState,
        },
      }

      cache.writeQuery({ query: GET_STATE, data })
      return data
    },
  },
}
