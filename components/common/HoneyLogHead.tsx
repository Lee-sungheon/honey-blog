import { SITE_URL } from '@constants/index';

export default function HoneyLogHead() {
  const title = 'HoneyLog';
  return (
    <head>
      <title>{title}</title>
      <meta name="google-site-verification" content="DLO38KAU7M6ZbYDtGdIdi1fr4AXOkCNuAXOGwtgVzR8" />
      <meta name="naver-site-verification" content="dc58ceaeb5cd037209c732a7a2ac3d9e65d00086" />
      <meta name="description" content={title} />
      <meta name="keywords" content={title} />

      <meta property="og:locale" content="ko_KR" />
      <meta property="og:site_name" content="honeylog" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={'Honey Log'} />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:type" content="article" />
      <meta property="og:keywords" content={`${title}`} />
      <meta property="og:image" content={'/thumbnail/default_thumbnail.jpeg'} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content="@honeylog" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:image" content={'/thumbnail/default_thumbnail.jpeg'} />

      <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      <link rel="manifest" href="/favicon/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="/favicon/ms-icon-144x144.png" />
      <meta name="theme-color" content="#ffffff" />
    </head>
  );
}
