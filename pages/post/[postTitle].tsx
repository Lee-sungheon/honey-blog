import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import dayjs from 'dayjs';
import { css } from '@emotion/react';

import { MarkdownViewer, DetailHeader, PrevNextPost, Comment } from '@components/PostDetail';
import { Header } from '@components/PostList';
import withPostDetailHead from '@hoc/withPostDetailHead';
import { IPostDetail } from '@type/index';
import { getMarkdownSplit } from '@utils/string';

export default withPostDetailHead(function PostPage({
  markdown,
  createdAt,
  title,
  thumbnail,
  prevPost,
  nextPost,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Header />
      <section
        css={css`
          max-width: 780px;
          margin: 0 auto;
          padding-top: 30px;
        `}>
        <DetailHeader title={title} createdAt={createdAt} thumbnail={thumbnail} />
        <MarkdownViewer markdown={markdown} />
        <PrevNextPost prevPost={prevPost} nextPost={nextPost} />
        <Comment />
      </section>
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
    const postTitle = ctx.params?.postTitle as string;
    const fs = require('fs');
    const fsPromises = require('fs').promises;
    const markdownFile = fs.readFileSync(`markdown/${postTitle}.md`, 'utf-8');
    const stats = await fsPromises.stat(`markdown/${postTitle}.md`);

    const { markdown, markdownInfo } = getMarkdownSplit(markdownFile);

    const markdownNameList: string[] = fs.readdirSync('markdown');

    const markdownInfoList = markdownNameList.map((markdownName) => {
      const markdownFile = fs.readFileSync(`markdown/${markdownName}`, 'utf-8');
      const { markdownInfo } = getMarkdownSplit(markdownFile);
      const createdAt = dayjs(markdownInfo['date']).format('YYYY-MM-DD HH:mm') ?? '';

      return {
        markdownName: markdownName.replace('.md', ''),
        title: markdownInfo['title'] ?? '',
        createdAt,
      };
    });

    const sortedMarkdownInfoList = markdownInfoList.sort((prevPost, nextPost) =>
      prevPost.createdAt > nextPost.createdAt ? -1 : 1,
    );

    const markdownIndex = sortedMarkdownInfoList.findIndex((value) => value.markdownName === postTitle);

    if (stats && markdown && markdownInfo) {
      const createdAt = dayjs(markdownInfo['date']).format('YYYY-MM-DD HH:mm') ?? '';
      return {
        props: {
          markdown,
          createdAt,
          title: markdownInfo['title'] ?? '',
          id: stats.ino,
          thumbnail: markdownInfo['thumbnail'] ?? '',
          prevPost: sortedMarkdownInfoList[markdownIndex - 1] ?? null,
          nextPost: sortedMarkdownInfoList[markdownIndex + 1] ?? null,
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
