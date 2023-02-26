module.exports = {
  siteUrl: 'https://honeylog.netlify.app/',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: ['/404'],
      },
      { userAgent: '*', allow: '/' },
    ],
  },
  generateIndexSitemap: false,
};
