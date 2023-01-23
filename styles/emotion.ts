import { css, keyframes } from '@emotion/react';
import { markdownLightStyle } from './githubMarkdown';

type ThemeType = typeof theme;

declare module '@emotion/react' {
  interface Theme extends ThemeType {
    colors: typeof theme.colors;
  }
}

const defaultStyles = css`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  body {
    padding: 30px 20px;
  }
`;

export const globalStyles = css([defaultStyles, markdownLightStyle]);

export const theme = {
  colors: {
    primary: 'hotpink',
  },
};

export const bounce = keyframes`
  from, 20%, 53%, 80%, to {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`;

export const keyframesExample = css([
  bounce,
  css({
    marginTop: '50px',
    width: '20px',
    height: '20px',
    background: 'black',
    borderRadius: '50%',
    padding: '20px',
    animation: `${bounce} 1s ease infinite`,
    transformOrigin: 'center',
  }),
]);
