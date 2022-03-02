import ReactDOM from 'react-dom';
import { RemixBrowser } from 'remix';
import * as Fathom from 'fathom-client';

Fathom.load('EPVCGNZL', {
  excludedDomains: ['localhost'],
  url: 'https://thirtyseven-active.b-cdn.net/script.js',
  spa: 'auto',
});

ReactDOM.hydrate(<RemixBrowser />, document);
