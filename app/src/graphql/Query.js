import gql from 'graphql-tag'

export const GET_STATE = gql`
  query getState {
    state @client {
      start
      test
      result
      finish
      current
      pub
    }
  }
`

export const GET_HOME = gql`
  query getHome($id: ID!) {
    test(where: { id: $id }) {
      title {
        pt
      }
      company {
        name
        abbr
      }
      instruction {
        title {
          pt
        }
        message {
          pt
        }
      }
    }
  }
`

export const GET_TEST = gql`
  query getTest($id: ID!, $types: [String!]!) {
    test(where: { id: $id }) {
      title @client {
        pt
      }
      steps(where: { type_some: { key_in: $types } }) {
        id
        question {
          pt
        }
        paths {
          items {
            id
          }
        }
        targets {
          id
        }
        type {
          key
        }
      }
      menus(where: { root: true }) {
        id
        order
        name {
          pt
        }
        items {
          id
          name {
            pt
          }
          items {
            id
            name {
              pt
            }
            items {
              id
              name {
                pt
              }
              items {
                id
                name {
                  pt
                }
              }
            }
          }
        }
      }
    }
  }
`
