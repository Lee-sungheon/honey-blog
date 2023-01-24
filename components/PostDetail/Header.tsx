import { useRouter } from 'next/router';

import styled from '@emotion/styled';
import { css } from '@emotion/css';

import { Thumbnail } from '@components/common';

export default function DetailHeader({ createdAt }: { createdAt: string }) {
  const router = useRouter();
  const title = router.query['postTitle'] as string;

  return (
    <>
      <Title>{title}</Title>
      <CreatedAtSpan>{createdAt}</CreatedAtSpan>
      <Thumbnail imageName={title} className={thumbnailStyle} />
    </>
  );
}

const Title = styled.h1`
  padding-bottom: 10px;
`;

const CreatedAtSpan = styled.span`
  display: inline-block;
  width: 100%;
  text-align: end;
  color: gray;
  padding-bottom: 20px;
`;

const thumbnailStyle = css`
  width: 100%;
  height: 100%;
  max-height: 80vh;
  padding-bottom: 40px;
  object-fit: contain;
`;
