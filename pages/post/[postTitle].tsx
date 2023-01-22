import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import MarkdownViewer from '@components/MarkdownViewer';

export default function PostPage({ markdown }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <MarkdownViewer markdown={markdown} />;
}

export const getServerSideProps: GetServerSideProps<{ markdown: string }> = async (ctx) => {
  try {
    const postTitle = (ctx.query['postTitle'] as string) ?? '';
    const fs = await import('fs');
    const markdown = fs.readFileSync(`markdown/${postTitle}.md`, 'utf8');

    return {
      props: { markdown: markdown },
    };
  } catch (error) {
    console.error(error);
    return {
      redirect: {
        destination: '/post/404',
        permanent: false,
      },
    };
  }
};