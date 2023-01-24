import Image from 'next/image';
import Link from 'next/link';

import { css } from '@emotion/react';

import { FlexRow } from '@components/common';
import honeyLogSvg from '../../public/hoenylog.svg';

export default function Header() {
  return (
    <FlexRow justifyContent={'space-between'} css={containerStyle}>
      <Link href={'/'}>
        <FlexRow>
          <Image src={honeyLogSvg} alt={'꿀벌 아이콘'} width={40} height={40} />
          <p css={titleStyle}>{'HoneyLog'}</p>
        </FlexRow>
      </Link>
    </FlexRow>
  );
}

const containerStyle = css`
  padding: 16px 0;
  max-width: 960px;
  margin: 0 auto;
`;

const titleStyle = css`
  padding-left: 10px;
  font-weight: bold;
  font-size: 1.315rem;
  font-family: 'Fira Mono', monospace;
`;
