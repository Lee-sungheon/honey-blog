import type { AppProps } from 'next/app';
import { Global, ThemeProvider } from '@emotion/react';

import { globalStyles, theme } from '../styles/emotion';

// require('../mocks');

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
