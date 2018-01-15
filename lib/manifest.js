import { description, name } from '../package.json';
import { colors } from '../style';

const manifest = () => `
{
  "name": "${name}",
  "short_name": "${name}",
  "description": "${description}",
  "start_url": "/?homescreen=1",
  "background_color": "${colors.primary}",
  "theme_color": "${colors.primary}",
  "display": "standalone",
  "icons": [
    {
      "src": "/static/images/11698668.jpg",
      "sizes": "72x72 96x96 128x128 144x144 256x256 512x512"
    }
  ]
}
`;

export default manifest;
