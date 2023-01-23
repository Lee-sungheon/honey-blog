import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import { css } from '@emotion/css';

import { MarkdownViewer, Header } from '@components/PostDetail';
import withPostDetailHead from '@hoc/withPostDetailHead';

const Comment = dynamic(() => import('@components/PostDetail/Comment'), { ssr: false });

export default withPostDetailHead(function PostPage({
  markdown,
  createdAt,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div
      className={css`
        margin: 0 auto;
        max-width: 780px;
      `}>
      <Header createdAt={createdAt} />
      <MarkdownViewer markdown={markdown} />
      <Comment />
    </div>
  );
});

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

export const getStaticProps: GetStaticProps<{ markdown: string; createdAt: string }> = async (ctx) => {
  try {
    const fs = require('fs');
    const fsPromises = require('fs').promises;
    const markdown = fs.readFileSync(`markdown/${ctx.params?.postTitle}.md`, 'utf-8');
    const stats = await fsPromises.stat(`markdown/${ctx.params?.postTitle}.md`);

    if (stats.birthtime && markdown) {
      const createdAt = dayjs(stats.birthtime).format('YYYY-MM-DD HH:mm');
      return { props: { markdown, createdAt } };
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
