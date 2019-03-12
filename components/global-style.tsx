import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 10px;
    touch-action: manipulation;
    box-sizing: border-box;
  }

  * {
    margin: 0;
    box-sizing: inherit;
  }

  html, body, #__next {
    height: 100%;
  }

  body {
    line-height: 1.3;
    font-family: 'Gotham Pro',-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    text-align: center;
    background: ${props => props.theme.background};
    @media (prefers-color-scheme: light) {
      background: ${props => props.theme.lightBackground};
    }

  }
`;

export default GlobalStyle;
