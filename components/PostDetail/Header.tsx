import styled from '@emotion/styled';
import { css } from '@emotion/css';

import { Thumbnail } from '@components/common';

interface IDetailHeaderProps {
  title: string;
  createdAt: string;
  thumbnail: string;
}

export default function DetailHeader({ title, createdAt, thumbnail }: IDetailHeaderProps) {
  return (
    <>
      <Title>{title}</Title>
      <CreatedAtSpan>{createdAt}</CreatedAtSpan>
      <Thumbnail imageName={thumbnail} className={thumbnailStyle} />
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
