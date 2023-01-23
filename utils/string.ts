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
