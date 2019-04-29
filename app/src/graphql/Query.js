import gql from 'graphql-tag'

export const GET_STATE = gql`
   query getState {
      state @client {
         test
         result
         current
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
         }
      }
   }
`

export const GET_TEST = gql`
   query FirstViewAndTest($id: ID!) {
      test(where: { id: $id }) {
         id
         title
         steps {
            id
            question
            path {
               id
            }
            target {
               id
            }
         }
         menus(where: { menu: null }) {
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
`
