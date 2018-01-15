export const colors = {
  primary: '#6c16c7'
};

const fontPath = 'https://mcan.sh/assets/fonts/';
const fonts = [
  {
    folder: 'Gotham',
    family: 'Gotham Pro',
    name: 'GothamPro',
    weight: 'normal',
    style: 'normal'
  }
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
