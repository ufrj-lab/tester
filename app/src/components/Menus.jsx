import React from 'react'
import { Link } from 'react-router-dom'
import { linkMenuSetStyle } from './_styles'

const LinkMenu = ({ id, hooks, name, className, selected, index }) => {
  const { next, active, path } = hooks

  const { actives, last } = active.data

  if (actives.length > 0) next.set(true)
  else next.set(false)

  return (
    <Link
      to="/teste"
      className={className}
      onClick={event => {
        event.preventDefault()

        if (last !== id) {
          path.set([...path.data, { id }])
        }

        if (selected) {
          actives.splice(index, 1)
          active.set({
            ...active.data,
            last: null,
            actives: [...actives],
          })
        } else {
          active.set({
            ...active.data,
            last: id,
            actives: [...actives, id],
          })
        }
      }}
    >
      {name}
    </Link>
  )
}

const LinkMenuStyled = linkMenuSetStyle(LinkMenu)
const Items = ({ items, hooks }) =>
  items.map(({ id, name, items: menus }) => {
    const { actives } = hooks.active.data
    const index = actives.indexOf(id)

    const linkProps = {
      hooks,
      id,
      name,
      index,
      selected: index !== -1,
    }

    return (
      <li key={id}>
        <LinkMenuStyled {...{ ...linkProps }} />
        {menus.length > 0 && <Menus {...{ hooks, menus }} />}
      </li>
    )
  })

export default function Menus({ menus, hooks }) {
  return menus.map(({ id, name, items }) => (
    <ul className="menu" key={id}>
      <Items {...{ hooks, id, name, items }} />
    </ul>
  ))
}
