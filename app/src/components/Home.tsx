import React, { Fragment } from 'react'

import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { Query, Mutation } from 'react-apollo'

import { GET_HOME } from '../graphql/Query'
import { CREATE_TEST_RESULT } from '../graphql/Mutation'

import { IComponentQueryWithTitle } from '../interfaces'
export default ({ prefixTitle, first = 1 }: IComponentQueryWithTitle) => 
      <Query query={ GET_HOME } variables={{ first }}>
        {
          ({ loading, error, data: { views } }: any) => {
              if (loading) return 'loading'
              if (error) return 'error'

              const [{ welcome, company, tests }] = views

              const [{ id }] = tests

              return (
                <Fragment>
                  <Helmet>
                      <title>{prefixTitle(welcome.title)}</title>
                  </Helmet>
                  <header>
                      <h1>{
                        (company.abbr && <abbr title={company.name}>{company.abbr}</abbr>) || company.title
                      }</h1>
                  </header>
                  <main>
                    <div dangerouslySetInnerHTML={{__html: welcome.message}}></div>
                    <Mutation mutation={ CREATE_TEST_RESULT }>
                      {
                        (run: any) => <Link to={{ pathname: "/teste", state: { id } }} onClick={() => {
                          run({variables: { start: new Date(), parent: id }})
                        }}>Começar</Link>
                      }
                    </Mutation>
                  </main>
                </Fragment>
              )
            }
          }
      </Query>

