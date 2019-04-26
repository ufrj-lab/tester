import React from 'react';
// import { Mutation } from 'react-apollo'

// import { MUTATION_SET_PATH } from '../graphql/Mutations'

const Items = ({ items }: any) => items.map(({ id, name, items: menus }: any) => 
        <li key={id}>
            {/* <Mutation mutation={MUTATION_SET_PATH} variables={{ menu: id }}>
                {(func: any) => (
                    <a href="/teste" onClick={event => {
                        event.preventDefault()
                        console.log(func)
                    }}>{name}</a>
                )}
            
            </Mutation> */}
            { menus.length > 0 && <Menus menus={menus}/> }
        </li>
    )

export default function Menus({ menus }: any) {
    return menus.map(({id, name, items}: any) =>
    <ul key={id}>
        <Items name={name} items={items}/>
    </ul>
    )
}