import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import styled from '@emotion/styled';
import { css } from '@emotion/css';

export default function Header({ createdAt }: { createdAt: string }) {
  const router = useRouter();
  const title = router.query['postTitle'] as string;

  const [imageSrc, setImageSrc] = useState<string>(`/thumbnail/${title}.jpeg`);

  return (
    <>
      <Title>{title}</Title>
      <CreatedAtSpan>{createdAt}</CreatedAtSpan>
      <Image
        src={imageSrc}
        alt={'썸네일 이미지'}
        width={600}
        height={300}
        className={thumbnailStyle}
        onError={() => setImageSrc('/thumbnail/default_thumbnail.jpeg')}
      />
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
  padding-bottom: 40px;
`;
