import React from 'react'
import { Mutation } from 'react-apollo'

// import { MUTATION_SET_PATH } from '../graphql/Mutation'

const Items = ({ items }) =>
  items.map(({ id, name, items: menus }) => (
    <li key={id}>
      {
        // <Mutation mutation={MUTATION_SET_PATH}>
        //   {func => (
        //     <a
        //       href="/teste"
        //       onClick={event => {
        //         event.preventDefault()
        //       }}
        //     >
        //       {name}
        //     </a>
        //   )}
        // </Mutation>
      }
      {menus.length > 0 && <Menus menus={menus} />}
    </li>
  ))

export default function Menus({ menus }) {
  return menus.map(({ id, name, items }) => (
    <ul key={id}>
      <Items name={name} items={items} />
    </ul>
  ))
}
