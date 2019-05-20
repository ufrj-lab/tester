import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { linkMenuSetStyle } from './_styles'
const LinkMenu = ({
  id,
  hooks,
  name: { pt: name },
  className,
  selected,
  depth,
}) => {
  const { next, active, path } = hooks

  const { actives, last } = active.data

  if (actives.length > 0) next.set(true)
  else next.set(false)

  return (
    <Link
      to="/test"
      className={className}
      onClick={event => {
        event.preventDefault()

        if (last !== id) {
          const newPath = [...path.data, { id }]
          path.set(newPath)
        }

        let newActivesObj = {}
        const newActivesArray = [...actives]

        newActivesArray.splice(depth, actives.length)

        if (!selected) newActivesArray[depth] = id

        newActivesObj = {
          ...active.data,
          last: id,
          actives: newActivesArray,
        }

        active.set(newActivesObj)
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
            > li {
              > a {
                pointer-events: all;
              }
            }
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
          > li {
            > a {
              pointer-events: all;
            }
          }
            
          `
        : ''
    }
  `}
`

function SubMenus({ items, hooks, className, depth = 0 }) {
  const { actives } = hooks.active.data
  return (
    (items && (
      <ul className={className}>
        {items.map(({ name, id, items }) => {
          const index = actives.indexOf(id)
          const selected = index !== -1 && index === depth
          return (
            <li key={id}>
              <LinkMenuStyled
                hooks={hooks}
                id={id}
                name={name}
                selected={selected}
                index={index}
                depth={depth}
              />
              <SubMenusStyled
                items={items}
                hooks={hooks}
                selected={selected}
                root={false}
                depth={depth + 1}
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
    {menus.map(({ id, name: { pt: name }, items, order }) => {
      return (
        <div key={id} style={{ order }}>
          <h2>{name}</h2>
          <SubMenusStyled items={items} hooks={hooks} root={true} />
        </div>
      )
    })}
  </nav>
)

const MenusStyled = styled(Menus)`
  display: flex;
  flex-direction: column;
  > div {
    > h2 {
      font-size: 0;
      margin: 0;
    }
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  &,
  ul,
  li {
    pointer-events: none;
  }
`
export default MenusStyled
