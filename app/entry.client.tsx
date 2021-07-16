import ReactDOM from 'react-dom';
import { RemixBrowser } from 'remix';
import * as Fathom from 'fathom-client';

Fathom.load('EPVCGNZL', {
  excludedDomains: ['localhost'],
  url: 'https://kiwi.mcan.sh/script.js',
  spa: 'auto',
});

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        // eslint-disable-next-line no-console
        .then(() => console.log('sw registered'))
        .catch(() => console.error('failed to register sw'));
    });
  }
}

ReactDOM.createRoot(document, { hydrate: true }).render(<RemixBrowser />);
