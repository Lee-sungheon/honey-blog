import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styled from '@emotion/styled';

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  const router = useRouter();
  const title = router.query['postTitle'] as string;

  return (
    <div className={'markdown-body'}>
      <Title>{title}</Title>
      <ReactMarkdown
        children={markdown
          .replace(/\n\s\n\s/gi, '\n\n&nbsp;\n\n')
          .replace(/\*\*/gi, '@$_%!^')
          .replace(/\**\*/gi, '/')
          .replace(/@\$_%!\^/gi, '**')
          .replace(/<\/?u>/gi, '*')}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <Prism
                children={String(children).replace(/\n$/, '')}
                style={atomDark as { [p: string]: any }}
                language={match[1]}
                PreTag={'div'}
                {...props}
              />
            ) : (
              <code className={className} style={{ color: 'white', backgroundColor: 'darkgray' }} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
}

const Title = styled.h1`
  padding-bottom: 20px;
`;
