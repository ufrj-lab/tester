import gql from 'graphql-tag'

export const GET_STATE = gql`
   query getState {
      state @client {
         test
         result
         finish
         current
         pub
      }
   }
`

export const GET_BASIC = gql`
   query getBasic($first: Int!) {
      views(first: $first) {
         id
         company {
            id
            name
            abbr
         }
      }
   }
`

export const GET_HOME = gql`
   query getHome($first: Int!) {
      views(first: $first) {
         id
         company @client {
            id
            name
            abbr
         }
         welcome {
            title
            message
         }
         tests(first: $first) {
            id
            title
         }
      }
   }
`

export const GET_TEST = (specific = false) =>
   gql(`
   query FirstViewAndTest($id: ID!, $key: String) {
      test(where: { id: $id }) {
         id
         title
         menus(where: { root: true }) {
            id
            name
            items {
               id
               name
               items {
                  id
                  name
                  items {
                     id
                     name
                  }
               }
            }
         }
      }
      keys {
         ${
            specific
               ? `
            specific: userType(where: { key: $key }) {
               key
               steps(where: { parent: { id: $id } }) {
                  id
                  question
                  paths {
                     paths {
                        id
                     }
                  }
                  targets {
                     id
                  }
               }
            }
            all: userType(where: { key: "ALL" }) {
               key
               steps(where: { parent: { id: $id } }) {
                  id
                  question
                  paths {
                     paths {
                        id
                     }
                  }
                  targets {
                     id
                  }
               }
            }
         `
               : `
            all: userType(where: { key: $key }) {
               key
               steps(where: { parent: { id: $id } }) {
                  id
                  question
                  paths {
                     paths {
                        id
                     }
                  }
                  targets {
                     id
                  }
               }
            }
         `
         }
         status: resultStatus {
            key
         }
      }
   }
`)
