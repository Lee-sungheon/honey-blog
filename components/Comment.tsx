export default function Comment() {
  return (
    <div
      ref={(elem) => {
        if (!elem) {
          return;
        }
        const scriptElem = document.createElement('script');
        scriptElem.src = 'https://utteranc.es/client.js';
        scriptElem.async = true;
        scriptElem.setAttribute('repo', 'sancy1003/Lee-sungheon/honey-blog');
        scriptElem.setAttribute('issue-term', 'pathname');
        scriptElem.setAttribute('theme', 'github-light');
        scriptElem.setAttribute('crossorigin', 'anonymous');
        scriptElem.crossOrigin = 'anonymous';
        elem.appendChild(scriptElem);
      }}
    />
  );
}
