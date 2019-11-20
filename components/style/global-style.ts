import { createGlobalStyle } from 'styled-components';
import { darken, normalize } from 'polished';

const GlobalStyle = createGlobalStyle`
  ${normalize()};

  * {
    box-sizing: border-box;
    margin: 0;
  }

  :root {
    --background: ${props => props.theme.background};
    --text: ${props => props.theme.text};
    --links: ${props => props.theme.links};

    @media (prefers-color-scheme: light) {
      --background: white;
      --text: black;
      --links: ${props => darken(0.2, props.theme.links)};
    }
  }

  html {
    font-size: 10px;
    touch-action: manipulation;
  }

  html, body, #__next {
    height: 100%;
  }

  body {
    font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    line-height: 1.47059;
    font-weight: normal;
    transition: background-color 0.2s ease 0s, color 0.2s ease 0s;
    background: var(--background);
    color: var(--text);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: normal;
  }
`;

export { GlobalStyle };
