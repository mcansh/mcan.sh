import { fontFace } from 'polished';

export const theme = {
  background: '#1d2330',
  links: '#ea567c',
  text: '#eef1f5',
};

const fontPath = 'https://mcan.sh/assets/fonts';

const fontFaces = fontFace({
  fontFamily: 'Gotham Pro',
  fontFilePath: `${fontPath}/Gotham/GothamPro`,
  fontDisplay: 'swap',
});

export { fontFaces as fontFace };
