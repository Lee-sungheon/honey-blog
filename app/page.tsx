/** @jsxImportSource @emotion/react */
'use client';
import styled from '@emotion/styled';

import { Header, PostList } from '@components/PostList';
import { FlexCol } from '@components/common';
import { SITE_URL } from '@constants/index';

async function getPostList() {
  const res = await fetch(`${SITE_URL}/api/post-list`, { next: { revalidate: 3600 } });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function PostListPage() {
  const postList = await getPostList();

  return (
    <>
      <Header />
      <PostListLayout>
        <PostList postList={postList} />
      </PostListLayout>
    </>
  );
}

const PostListLayout = styled(FlexCol)`
  max-width: 780px;
  margin: 0 auto;
  padding-top: 30px;
`;
