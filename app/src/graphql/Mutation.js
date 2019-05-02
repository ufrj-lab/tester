import gql from 'graphql-tag'

export const CREATE_TEST_RESULT = gql`
   mutation createTestResult($parent: ID!, $start: DateTime!) {
      createTestResult(
         data: { start: $start, parent: { connect: { id: $parent } } }
      ) {
         id
      }
   }
`

export const CREATE_STEP_RESULT = gql`
   mutation createStepResult(
      $parent: ID!
      $result: ID!
      $start: DateTime!
      $end: DateTime!
      $path: [MenuWhereUniqueInput!]!
      $timeInt: Int!
      $timeText: String!
   ) {
      createStepResult(
         data: {
            start: $start
            end: $end
            parent: { connect: { id: $parent } }
            resultParent: { connect: { id: $result } }
            time: { create: { int: $timeInt, text: $timeText } }
            path: { connect: $path }
         }
      ) {
         id
      }
   }
`

export const UPDATE_STATE = gql`
   mutation updateState(
      $test: ID
      $result: ID
      $current: Int
      $finish: Boolean
   ) {
      updateState(
         test: $test
         result: $result
         current: $current
         finish: $finish
      ) @client
   }
`
