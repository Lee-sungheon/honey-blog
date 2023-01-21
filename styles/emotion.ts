import { css, keyframes } from '@emotion/react';

type ThemeType = typeof theme;

declare module '@emotion/react' {
  interface Theme extends ThemeType {
    colors: typeof theme.colors;
  }
}

export const globalStyles = css`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
`;

export const theme = {
  colors: {
    primary: 'hotpink',
  },
};

export const someMoreBasicStyles = css`
  background-color: green;
  color: white;
  margin-bottom: 10px;
  padding: 10px;
`;

export const someCssAsObject = css({
  background: 'orange',
  color: 'white',
  padding: '10px',
  marginBottom: '10px',
});

export const combinedAsArray = css([someMoreBasicStyles, someCssAsObject]);

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
