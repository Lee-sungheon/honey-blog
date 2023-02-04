import Head from 'next/head';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';

import { SITE_URL } from '@constants/index';
import { getBeginningContent } from '@utils/string';

export default function withPostDetailHead(Component: AppProps['Component']) {
  return function withPostDetailHeadRender(props: AppProps['pageProps']) {
    const router = useRouter();

    const title = props['title'] ?? '';
    const postRoute = router.query['postTitle'] ?? '';
    const content = getBeginningContent(props.markdown ?? '', 250);
    const thumbnail = props['thumbnail'] ?? '';

    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="google-site-verification" content="DLO38KAU7M6ZbYDtGdIdi1fr4AXOkCNuAXOGwtgVzR8" />
          <meta name="naver-site-verification" content="dc58ceaeb5cd037209c732a7a2ac3d9e65d00086" />
          <meta name="description" content={content} />
          <meta name="keywords" content={`${title}`} />
          <meta property="published_time" content={props?.createdAt?.writtenAt ?? ''} />

          <meta property="og:locale" content="ko_KR" />
          <meta property="og:site_name" content="honeylog" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={content} />
          <meta property="og:url" content={`${SITE_URL}/post/${postRoute}`} />
          <meta property="og:type" content="article" />
          <meta property="og:keywords" content={`${title}`} />
          <meta property="og:image" content={`/thumbnail/${thumbnail}`} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:site" content="@honeylog" />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:image" content={`/thumbnail/${thumbnail}`} />
        </Head>
        <Component {...props} />
      </>
    );
  };
}
