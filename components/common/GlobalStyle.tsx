'use client';
import { globalStyles } from '@styles/emotion';
import { Global } from '@emotion/react';

export default function GlobalStyle() {
  return <Global styles={globalStyles} />;
}
