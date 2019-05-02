import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const LinkMenu = ({
  id,
  next: { next, setNext },
  path: { path, setPath },
  active: { active, setActive },
  name,
}) => {
  const { actives, last } = active

  const include = actives.includes(id)

  console.log('ACTIVE', active)
  return (
    <Link
      to="/teste"
      className={`btn --menu${include ? ' --active' : ''}`}
      onClick={event => {
        event.preventDefault()

        setPath([...path, { id }])

        if (actives.length > 0) setNext(true)
        else setNext(false)

        if (last !== id) {
          setPath([...path, { id }])
          if (!include) {
            setActive({
              ...active,
              last: id,
              actives: [...actives, id],
            })
          }
        }
      }}
    >
      {name}
    </Link>
  )
}
const Items = ({ items, path, next, active }) =>
  items.map(({ id, name, items: menus }) => {
    const state = {
      path,
      next,
      active,
    }
    return (
      <li key={id}>
        <LinkMenu {...{ ...state, id, name }} />
        {menus.length > 0 && <Menus {...{ ...state, menus }} />}
      </li>
    )
  })

export default function Menus({ menus, path, next, active }) {
  const state = {
    path,
    next,
    active,
  }
  return menus.map(({ id, name, items }) => (
    <ul className="menu" key={id}>
      <Items {...{ ...state, id, name, items }} />
    </ul>
  ))
}
