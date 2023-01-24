import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import dayjs from 'dayjs';

import { IPostListItem } from '@types/index';
import { FlexCol, Thumbnail } from '@components/common';

export default function PostList({ postList }: { postList: IPostListItem[] }) {
  return (
    <FlexCol>
      {postList.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </FlexCol>
  );
}

function PostListItem({ post }: { post: IPostListItem }) {
  const router = useRouter();
  return (
    <FlexCol alignItems={'start'} css={containerStyle} onClick={() => router.push(`/post/${post.title}`)}>
      <Thumbnail imageName={post.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
      <p css={titleStyle}>{post.title}</p>
      <p css={contentStyle}>{post.content}</p>
      <p css={dateStyle}>{dayjs(post.createdAt).format('YYYY년 MM월 DD일')}</p>
    </FlexCol>
  );
}

const containerStyle = css`
  cursor: pointer;
  padding: 20px 0;
  overflow: hidden;
  margin-bottom: 20px;
  gap: 8px;
`;

const contentStyle = css`
  font-size: 1rem;
  margin-bottom: 9px;

  color: #495057;
  display: -webkit-box;
  word-wrap: break-word;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  white-space: pre-wrap;
`;

const titleStyle = css`
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 9px;
`;

const dateStyle = css`
  font-size: 0.875rem;
  color: #868e96;
`;
