import React, { Fragment } from 'react'

import { Link } from "react-router-dom"
import { Helmet } from 'react-helmet'

import { Query, Mutation } from 'react-apollo'

import { GET_TEST } from '../graphql/Query'
import { CREATE_STEP_RESULT } from "../graphql/Mutation";

import { IComponentQueryWithTitle } from '../interfaces';

import Menus from './Menus'



export default ({ prefixTitle , location: { state: { id } } }: IComponentQueryWithTitle)  => 
    <Query query={ GET_TEST } variables={{ id }}>
        {
            ({loading, error, data: { test } }: any) => {
                if (loading) return  null
                if (error) return  null

                const { menus, title }= test

                return (
                    
                        <Mutation mutation={CREATE_STEP_RESULT} variables={{}}>
                            {(run: any) => {
                                run()
                                return (
                                    <Fragment>
                                        <Helmet>
                                            <title>{prefixTitle(title)}</title>
                                        </Helmet>
                                        <header>
                
                                        </header>
                                        <main>
                                            <nav>
                                                <Menus menus={ menus }/>
                                            </nav>
                                            <Link to="/">Proximo</Link>
                                        </main>
                                    </Fragment>
                                )
                            }}
                        </Mutation>
                        
                )
            }
        }
    </Query>

    

