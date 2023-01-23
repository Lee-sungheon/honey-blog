import { css } from '@emotion/css';

export default function Comment() {
  const setUtterancScript = (elem: HTMLDivElement | null) => {
    if (!elem) {
      return;
    }
    const scriptElem = document.createElement('script');
    scriptElem.src = 'https://utteranc.es/client.js';
    scriptElem.async = true;
    scriptElem.setAttribute('repo', 'Lee-sungheon/honey-blog');
    scriptElem.setAttribute('issue-term', 'pathname');
    scriptElem.setAttribute('theme', 'github-light');
    scriptElem.setAttribute('crossorigin', 'anonymous');
    scriptElem.crossOrigin = 'anonymous';
    elem.appendChild(scriptElem);
  };

  return (
    <div
      className={css`
        padding-top: 40px;
      `}
      ref={setUtterancScript}
    />
  );
}
