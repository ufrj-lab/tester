import styled, { createGlobalStyle } from 'styled-components'

export const variables = {
  fontFamily: {
    serif: 'serif',
    sansSerif: `'Alegreya Sans', sans-serif`,
  },
  colors: {
    black: '#222',
    gray: '#eee',
    white: '#fff',
    primary: '#003399',
    success: 'green',
    error: 'red',
    error25: '#ff00001a',
    warning: 'orange',
  },
  shadows: {
    base: '0px 2px 10px #0000001a',
    init: '0px 2px 2px #0000001a',
  },
}

export const switchColor = color => variables.colors[color]

export const setFont = ({
  serif = false,
  weight = 400,
  textDecoration = 'none',
  textTransform = 'none',
  txColor: color = 'white',
  fontSize = '1em',
}) => {
  const { fontFamily } = variables
  return `
      font-size: ${fontSize}
      font-family: ${serif ? fontFamily.serif : fontFamily.sansSerif};
      font-weight: ${weight};
      text-decoration: ${textDecoration};
      text-transform: ${textTransform};
      color: ${switchColor(color)};
   `
}

export const linkMenuSetStyle = component => styled(component)`
  ${({ txColor = 'primary', selected }) => `
      display: flex;
      border: 2px solid;
      ${setFont({ weight: 700, txColor })}
      margin: 0 .5rem;
      margin-bottom: 1em;
      padding: .5em 1em;
      border-radius: 3px;
      box-shadow: ${variables.shadows.init};
      background-color: ${switchColor('white')};
      white-space: nowrap;
      transform: translateX(0);
      transition: .3s;
      ${
        selected
          ? `
               color: ${switchColor('white')} !important;
               background-color: ${switchColor('success')} !important;
               border-color: ${switchColor('success')} !important;
               box-shadow: ${variables.shadows.base};
               z-index: 9999;
               position: relative;
               &:hover {
                  background-color: ${switchColor('primary')} !important;
                  border-color: ${switchColor('primary')} !important;
               }
            `
          : `
               
                
            `
      }
      & + ul {
         width: 100%;
         left: 0;
         a {
            margin-bottom: 1em
         }
      }
      &:hover {
         color: ${switchColor('white')};
         background-color: ${switchColor(txColor)};
         border-color: ${switchColor(txColor)};
         box-shadow: ${variables.shadows.base};
      }
   
   `}
`

export const btnSetStyle = component => styled(component)`
  display: flex;
  padding: 0.5em 1em;
  border: 2px solid;
  border-radius: 3px;
  margin-top: 1.5rem;
  opacity: 1;
  abbr {
    text-decoration: none;
  }
  &.--big {
    font-size: 1.5rem;
    margin-top: calc(2rem + 5vh);
  }
  transition: 0.3s;
  z-index: 9999;
  box-shadow: ${variables.shadows.init};
  ${({ bgColor = 'primary', txColor = 'white', disabled, center }) => {
    const colorOne = switchColor(bgColor)
    return `
         ${setFont({ weight: 700, txColor })}
         background-color: ${colorOne};
         border-color: ${colorOne};
         ${
           disabled
             ? `
               opacity: 0.5;
               cursor: not-allowed;
            `
             : `
               
            `
         }
         ${
           center
             ? `
                  align-self: center;
               `
             : ``
         }
      `
  }}
  &:hover, &:focus {
    box-shadow: ${variables.shadows.base};
    ${({ bgColor = 'primary', txColor = 'white', disabled }) => {
      const colorOne = switchColor(bgColor)
      const colorTwo = switchColor(txColor)
      return disabled
        ? ''
        : `
            color: ${colorOne};
            background-color: ${colorTwo};
            border-color: ${colorOne};
         `
    }}
  }
`

export const boxContentSetStyle = component => styled(component)`
   display: flex;
   flex-direction: column;
   max-width: 500px;
   align-items: flex-start;
   padding: 2rem;
   margin-top: 2rem;

   background-color: ${switchColor('white')};
   border-radius: 3px;
   box-shadow: ${variables.shadows.base};

   .big {
      font-size: 3rem;
      color: ${switchColor('primary')};
   }
   .error {
      padding: .25em;
      border-radius: 3px;
      color: ${switchColor('error')}
      background-color: ${switchColor('error25')};
   }

   h2 {
      margin-top: 0;
   }
   p {
      margin-top: 0;
   }
   li {
      margin-bottom: 1rem;
   }
`

export default createGlobalStyle`
   body {
      margin: 0;
      padding: 0;
      font-size: 1.1rem;
      line-height: 1.333;
      font-family: ${variables.fontFamily.sansSerif};
      background-color: ${switchColor('gray')}
      #root {
         min-height: 100vh;
         display: flex;
         flex-direction: column;
         align-items: center;
         padding-bottom: 2rem;
         box-sizing: border-box;
      }
   } 
`
