import gql from 'graphql-tag'

export const CREATE_TEST_RESULT = gql`
  mutation createTestResult($parent: ID!, $start: DateTime!, $status: String!) {
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
    $time: Int!
  ) {
    updateTestResult(
      where: { id: $id }
      data: { status: { connect: { key: $status } }, end: $end, time: $time }
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
    $time: Int!
    $status: String!
  ) {
    createStepResult(
      data: {
        start: $start
        end: $end
        parent: { connect: { id: $parent } }
        result: { connect: { id: $result } }
        time: $time
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
    $start: DateTime
    $test: ID
    $result: ID
    $current: Int
    $finish: Boolean
    $pub: String
  ) {
    updateState(
      start: $start
      test: $test
      result: $result
      current: $current
      finish: $finish
      pub: $pub
    ) @client
  }
`
