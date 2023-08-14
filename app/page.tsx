/** @jsxImportSource @emotion/react */
'use client';

import { Header, PostList } from '@components/PostList';
import { FlexCol } from '@components/common';
import styled from '@emotion/styled';
import withPostDetailHead from '@hoc/withPostDetailHead';

export default withPostDetailHead(function Page() {
  return (
    <>
      <Header />
      <PostListLayout>
        <PostList postList={[]} />
      </PostListLayout>
    </>
  );
});

const PostListLayout = styled(FlexCol)`
  max-width: 780px;
  margin: 0 auto;
  padding-top: 30px;
`;
