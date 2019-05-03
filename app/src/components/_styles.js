import styled, { createGlobalStyle } from 'styled-components'

const variables = {
   fontFamily: {
      serif: 'serif',
      sansSerif: `'Alegreya Sans', sans-serif`,
   },
   colors: {
      black: '#222',
      white: '#fff',
      primary: '#003399',
      success: 'green',
      error: 'red',
      warning: 'orange',
   },
}

const switchColor = ({ color }) => {
   const { colors } = variables
   const { black, white, primary, success, error, warning } = colors

   let result = primary
   switch (color) {
      case 'primary':
         break
      case 'white':
         result = white
         break
      case 'black':
         result = black
         break
      case 'success':
         result = success
         break
      case 'error':
         result = error
         break
      case 'warning':
         result = warning
         break
      default:
         break
   }
   return result
}

const setFont = ({
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
      color: ${switchColor({ color })};
   `
}

export const linkMenuSetStyle = component => styled(component)`
   ${({ txColor = 'black' }) => setFont({ weight: 700, txColor })}
`

export const btnSetStyle = component => styled(component)`
   ${({ txColor }) => setFont({ weight: 700, txColor })}
   background-color: ${({ bgColor: color }) => switchColor({ color })};
   padding: 0.5em 1em;
   border-radius: 3px;
   opacity: ${({ disabled }) => {
      return disabled ? '0.5' : '1'
   }};
`

export default createGlobalStyle`
   body {
      margin: 0;
      padding: 0;
      font-size: 1rem;
      line-height: 1.333;
      font-family: ${variables.fontFamily.sansSerif};
   }  
`
