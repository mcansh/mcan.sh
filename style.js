import theme from 'styled-theming';

const links = theme('mode', {
  light: '#6c16c7',
  dark: '#9240ea',
});

const background = theme('mode', {
  light: '#f3f4f6',
  dark: 'black',
});

const text = theme('mode', {
  light: 'black',
  dark: 'white',
});

export const colors = {
  links,
  background,
  text,
};

const fontPath = 'https://mcan.sh/assets/fonts/';
const fonts = [
  {
    folder: 'Gotham',
    family: 'Gotham Pro',
    name: 'GothamPro',
    weight: 'normal',
    style: 'normal',
  },
];

/* prettier-ignore */
export const fontFace = fonts
  .map(
    font => `
      @font-face {
        font-family: 'Gotham Pro';
        src: url('${fontPath}/${font.folder}/${font.name}.eot');
        src: url('${fontPath}/${font.folder}/${font.name}.eot?#iefix') format('embedded-opentype'),
             url('${fontPath}/${font.folder}/${font.name}.woff2') format('woff2'),
             url('${fontPath}/${font.folder}/${font.name}.woff') format('woff'),
             url('${fontPath}/${font.folder}/${font.name}.ttf') format('truetype'),
             url('${fontPath}/${font.folder}/${font.name}.svg#${font.name}') format('svg');
        font-weight: normal;
        font-style: normal;
      }
    `
  )
  .join('');
/* prettier-ignore */
