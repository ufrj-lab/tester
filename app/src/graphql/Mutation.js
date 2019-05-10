import gql from 'graphql-tag'

export const CREATE_TEST_RESULT = gql`
   mutation createTestResult(
      $parent: ID!
      $start: DateTime!
      $status: String!
   ) {
      createTestResult(
         data: {
            start: $start
            parent: { connect: { id: $parent } }
            status: { connect: { key: $status } }
         }
      ) {
         id
      }
   }
`

export const UPDATE_TEST_RESULT = gql`
   mutation updateTestResult(
      $id: ID!
      $status: String!
      $end: DateTime!
      $timeInt: Int!
      $timeText: String!
   ) {
      updateTestResult(
         where: { id: $id }
         data: {
            status: { connect: { key: $status } }
            end: $end
            time: { create: { int: $timeInt, text: $timeText } }
         }
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
      $status: String!
   ) {
      createStepResult(
         data: {
            start: $start
            end: $end
            parent: { connect: { id: $parent } }
            resultParent: { connect: { id: $result } }
            time: { create: { int: $timeInt, text: $timeText } }
            path: { connect: $path }
            status: { connect: { key: $status } }
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
      $pub: String
   ) {
      updateState(
         test: $test
         result: $result
         current: $current
         finish: $finish
         pub: $pub
      ) @client
   }
`
