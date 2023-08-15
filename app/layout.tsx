'use client';
import { theme } from '@styles/emotion';
import { ThemeProvider } from '@emotion/react';

import GlobalStyle from '@components/common/GlobalStyle';

import RootStyleRegistry from './emotion';
import HoneyLogHead from '@components/common/HoneyLogHead';

export default function RootLayout({ children }: { children: JSX.Element }) {
  return (
    <html>
      <HoneyLogHead />
      <body>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <RootStyleRegistry>{children}</RootStyleRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
