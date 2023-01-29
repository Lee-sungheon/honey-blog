import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import { css } from '@emotion/react';

import { MarkdownViewer, DetailHeader } from '@components/PostDetail';
import { Header } from '@components/PostList';
import withPostDetailHead from '@hoc/withPostDetailHead';
import { IPostDetail } from '@type/index';
import { getMarkdownSplit } from '@utils/string';

const Comment = dynamic(() => import('@components/PostDetail/Comment'), { ssr: false });

export default withPostDetailHead(function PostPage({
  markdown,
  createdAt,
  title,
  thumbnail,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Header />
      <div
        css={css`
          max-width: 780px;
          margin: 0 auto;
          padding-top: 30px;
        `}>
        <DetailHeader title={title} createdAt={createdAt} thumbnail={thumbnail} />
        <MarkdownViewer markdown={markdown} />
        <Comment />
      </div>
    </>
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

export const getStaticProps: GetStaticProps<IPostDetail> = async (ctx) => {
  try {
    const fs = require('fs');
    const fsPromises = require('fs').promises;
    const markdownFile = fs.readFileSync(`markdown/${ctx.params?.postTitle}.md`, 'utf-8');
    const stats = await fsPromises.stat(`markdown/${ctx.params?.postTitle}.md`);

    const { markdown, markdownInfo } = getMarkdownSplit(markdownFile);

    if (stats && markdown && markdownInfo) {
      const createdAt = dayjs(markdownInfo['date']).format('YYYY-MM-DD HH:mm') ?? '';
      return {
        props: {
          markdown,
          createdAt,
          title: markdownInfo['title'] ?? '',
          id: stats.ino,
          thumbnail: markdownInfo['thumbnail'] ?? '',
        },
      };
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
