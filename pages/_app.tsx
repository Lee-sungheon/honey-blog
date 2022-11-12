import type { AppProps } from 'next/app';
import '../styles/globals.css';

require('../mocks');

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
