import { useRouter } from 'next/router';

import { IPrevNextPost } from '@type/index';
import { FlexCol, FlexRow } from '@components/common';
import { css } from '@emotion/react';

interface PrevNextPostProps {
  prevPost: IPrevNextPost | null;
  nextPost: IPrevNextPost | null;
}

export default function PrevNextPost({ prevPost, nextPost }: PrevNextPostProps) {
  const router = useRouter();
  return (
    <FlexCol
      css={css`
        padding: 40px 0;
        gap: 16px;
      `}>
      {prevPost?.title && (
        <FlexRow
          justifyContent={'flex-start'}
          css={itemStyle}
          onClick={() => router.push(`/post/${prevPost.markdownName}`)}>
          <span>{'👈'}</span>
          <p css={textStyle}>{`이전글: ${prevPost.title}`}</p>
        </FlexRow>
      )}
      {nextPost?.title && (
        <FlexRow
          justifyContent={'flex-end'}
          css={itemStyle}
          onClick={() => router.push(`/post/${nextPost.markdownName}`)}>
          <p css={textStyle}>{`다음글: ${nextPost.title} `}</p>
          <span>{'👉'}</span>
        </FlexRow>
      )}
    </FlexCol>
  );
}

const itemStyle = css`
  width: 100%;
  cursor: pointer;
`;

const textStyle = css`
  color: lightslategray;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  font-size: 14px;
  padding: 0 5px;
`;
