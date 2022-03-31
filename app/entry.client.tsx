import ReactDOM from 'react-dom/client';
import { RemixBrowser } from '@remix-run/react';
import * as Fathom from 'fathom-client';

Fathom.load('EPVCGNZL', {
  excludedDomains: ['localhost'],
  url: 'https://thirtyseven-active.b-cdn.net/script.js',
  spa: 'auto',
});

ReactDOM.hydrateRoot(document, <RemixBrowser />);
