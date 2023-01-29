export const getBeginningContent = (content: string, length: number) => {
  return content.replace(/\n|#|-/g, '').slice(0, length) ?? '';
};

export const formatMarkdown = (markdown: string) => {
  return markdown
    .replace(/\n\s\n\s/gi, '\n\n&nbsp;\n\n')
    .replace(/\*\*/gi, '@$_%!^')
    .replace(/\**\*/gi, '/')
    .replace(/@\$_%!\^/gi, '**')
    .replace(/<\/?u>/gi, '*');
};

export const getMarkdownSplit = (markdownFile: string) => {
  const markdownSplit = markdownFile.split('---');
  const [, stringMarkdownInfo, ...markdown] = markdownSplit;
  const stringMarkdownInfoSplit = stringMarkdownInfo.split('\n');

  const markdownInfo = stringMarkdownInfoSplit.reduce((acc: { [key: string]: string }, markdownInfo: string) => {
    if (markdownInfo) {
      const [key, value] = markdownInfo.split(':');
      return {
        ...acc,
        [key]: value.trim(),
      };
    }
    return acc;
  }, {});

  return {
    markdownInfo,
    markdown: markdown.join(''),
  };
};
