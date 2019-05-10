import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { linkMenuSetStyle, switchColor } from './_styles'
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

const SubMenusStyled = styled(SubMenus)`
  ${({ selected, root }) => `
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    ${
      root
        ? `
            position: relative;
            margin-bottom: 1rem !important;
          `
        : `
            opacity: 0;
            pointer-events: none;
            position: absolute;
        `
    }

    ${
      selected
        ? `
          opacity: 1;
          pointer-events: all;
          z-index: 9999;
            
          `
        : ''
    }
  `}
`

function SubMenus({ items, hooks, className }) {
  const { actives } = hooks.active.data
  return (
    (items && (
      <ul className={className}>
        {items.map(({ name, id, items }) => {
          const index = actives.indexOf(id)
          const selected = index !== -1
          return (
            <li key={id}>
              <LinkMenuStyled
                hooks={hooks}
                id={id}
                name={name}
                selected={selected}
                index={index}
              />
              <SubMenusStyled
                items={items}
                hooks={hooks}
                selected={selected}
                root={false}
              />
            </li>
          )
        })}
      </ul>
    )) ||
    null
  )
}

const Menus = ({ menus, hooks, className }) => (
  <nav className={className}>
    {menus.map(({ id, name, items }) => {
      return (
        <div key={id}>
          <h2>{name}</h2>
          <SubMenusStyled items={items} hooks={hooks} root={true} />
        </div>
      )
    })}
  </nav>
)

const MenusStyled = styled(Menus)`
  display: flex;
  flex-direction: column-reverse;
  & > div > h2 {
    font-size: 0;
    margin: 0;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`
export default MenusStyled
