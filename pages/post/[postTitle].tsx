import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import MarkdownViewer from '@components/MarkdownViewer';
import dynamic from 'next/dynamic';
// import Comment from '@components/Comment';
const Comment = dynamic(() => import('@components/Comment'), { ssr: false });

export default function PostPage({ markdown }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <MarkdownViewer markdown={markdown} />
      <Comment />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const fs = await import('fs');
  const markdownList = fs.readdirSync('markdown');

  const paths = markdownList.map((markdownName) => {
    return {
      params: { postTitle: markdownName.split('.md')[0] },
    };
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{ markdown: string }> = async (ctx) => {
  try {
    const fs = await import('fs');
    const markdown = fs.readFileSync(`markdown/${ctx.params?.postTitle}.md`, 'utf-8');

    if (markdown) {
      return { props: { markdown } };
    } else {
      return {
        redirect: {
          destination: '/post/404',
          permanent: false,
        },
      };
    }
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
