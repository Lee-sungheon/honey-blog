import Head from 'next/head';
import { AppProps } from 'next/app';

import { SITE_URL } from '@constants/index';
import { getBeginningContent } from '@utils/string';

export default function withPostDetailHead(Component: AppProps['Component']) {
  return function withPostDetailHeadRender(props: AppProps['pageProps']) {
    const title = props['title'] ?? '';
    const content = getBeginningContent(props.markdown ?? '', 250);

    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content={content} />
          <meta name="keywords" content={`${title}`} />
          <meta property="published_time" content={props?.createdAt?.writtenAt ?? ''} />

          <meta property="og:locale" content="ko_KR" />
          <meta property="og:site_name" content="honeylog" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={content} />
          <meta property="og:url" content={`${SITE_URL}/post/${title}`} />
          <meta property="og:type" content="article" />
          <meta property="og:keywords" content={`${title}`} />
          <meta property="og:image" content={`/thumbnail/${title}.jpeg`} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:site" content="@honeylog" />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:image" content={`/thumbnail/${title}.jpeg`} />
        </Head>
        <Component {...props} />
      </>
    );
  };
}
