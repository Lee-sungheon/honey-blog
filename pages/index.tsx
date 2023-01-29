import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dayjs from 'dayjs';

import withHoneyLogHead from '@hoc/withHoneyLogHead';
import { getBeginningContent, getMarkdownSplit } from '@utils/string';
import { IPostListItem } from '@type/index';

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

    const markdownNameList: string[] = fs.readdirSync('markdown');

    const promisedPostList = markdownNameList.reduce(async (acc: Promise<IPostListItem[]>, markdownName) => {
      const markdownFile = fs.readFileSync(`markdown/${markdownName}`, 'utf-8');
      const stats = await fsPromises.stat(`markdown/${markdownName}`);

      const { markdown, markdownInfo } = getMarkdownSplit(markdownFile);

      const createdAt = dayjs(markdownInfo['date']).format('YYYY-MM-DD HH:mm') ?? '';

      const promisedAcc = await acc;

      return Promise.resolve([
        ...promisedAcc,
        {
          id: stats.ino,
          markdownName: markdownName.replace('.md', ''),
          title: markdownInfo['title'] ?? '',
          content: getBeginningContent(markdown, 250),
          createdAt,
          thumbnail: markdownInfo['thumbnail'] ?? '',
        },
      ]);
    }, Promise.resolve([]));

    const postList = await Promise.resolve(promisedPostList);
    const sortedPostList = postList.sort((prevPost, nextPost) => (prevPost.createdAt > nextPost.createdAt ? -1 : 1));

    return { props: { postList: sortedPostList } };
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
