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
   mutation createStepResult($parent: ID!, $result: ID!, $start: DateTime!) {
      createStepResult(
         data: {
            start: $start
            parent: { connect: { id: $parent } }
            resultParent: { connect: { id: $result } }
         }
      ) {
         id
      }
   }
`

export const UPDATE_STATE = gql`
   mutation updateState($test: ID, $result: ID, $current: Int) {
      updateState(test: $test, result: $result, current: $current) @client
   }
`
