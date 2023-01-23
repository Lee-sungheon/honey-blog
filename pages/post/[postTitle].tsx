import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import MarkdownViewer from '@components/MarkdownViewer';
import dynamic from 'next/dynamic';
// import Comment from '@components/Comment';
const Comment = dynamic(() => import('@components/Comment'), { ssr: false });

export default function PostPage({ markdown }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <MarkdownViewer markdown={markdown} />
      <Comment />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{ markdown: string }> = async (ctx) => {
  try {
    const postTitle = (ctx.query['postTitle'] as string) ?? '';
    const fs = await import('fs');
    const markdown = fs.readFileSync(`markdown/${postTitle}.md`, 'utf-8');

    return { props: { markdown } };
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
