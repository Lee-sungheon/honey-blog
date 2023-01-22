import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';

const MarkdownViewer = dynamic(() => import('../../components/MarkdownViewer'), {
  ssr: false,
});

export default function PostPage({ markdown }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <MarkdownViewer markdown={markdown} />;
}

export const getServerSideProps: GetServerSideProps<{ markdown: string }> = async (ctx) => {
  const postTitle = (ctx.query['postTitle'] as string) ?? '';
  const fs = await import('fs');
  const markdown = fs.readFileSync(`markdown/${postTitle}.md`, 'utf8');

  return {
    props: {
      markdown: markdown,
    },
  };
};
