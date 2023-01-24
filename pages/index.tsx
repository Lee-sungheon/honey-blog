import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dayjs from 'dayjs';

import withHoneyLogHead from '@hoc/withHoneyLogHead';
import { getBeginningContent } from '@utils/string';
import { IPostListItem } from '@types/index';

import { FlexCol } from '@components/common';
import { PostList, Header } from '@components/PostList';
import { css } from '@emotion/react';

export default withHoneyLogHead(function MainPage({ postList }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Header />
      <FlexCol
        css={css`
          max-width: 780px;
          margin: 0 auto;
          padding-top: 30px;
        `}>
        <PostList postList={postList} />
      </FlexCol>
    </>
  );
});

export const getStaticProps: GetStaticProps<{ postList: IPostListItem[] }> = async () => {
  try {
    const fs = require('fs');
    const fsPromises = require('fs').promises;

    const markdownList: string[] = fs.readdirSync('markdown');

    const promisedPostList = markdownList.reduce(async (acc: Promise<IPostListItem[]>, markdown) => {
      const markdownFile = fs.readFileSync(`markdown/${markdown}`, 'utf-8');
      const stats = await fsPromises.stat(`markdown/${markdown}`);
      const createdAt = dayjs(stats.birthtime).format('YYYY-MM-DD HH:mm');

      const promisedAcc = await acc;

      return Promise.resolve([
        ...promisedAcc,
        {
          id: stats.ino,
          title: markdown.split('.md')[0],
          content: getBeginningContent(markdownFile, 250),
          createdAt,
        },
      ]);
    }, Promise.resolve([]));

    const postList = await Promise.resolve(promisedPostList);

    return { props: { postList } };
  } catch (error) {
    console.error(error);
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }
};
