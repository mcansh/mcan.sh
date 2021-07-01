import ReactDOM from 'react-dom';
import { RemixBrowser } from 'remix';
import * as Fathom from 'fathom-client';

Fathom.load('EPVCGNZL', {
  excludedDomains: ['localhost'],
  url: 'https://kiwi.mcan.sh/script.js',
  spa: 'auto',
});

ReactDOM.createRoot(document, { hydrate: true }).render(<RemixBrowser />);
