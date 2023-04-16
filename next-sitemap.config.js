module.exports = {
  siteUrl: 'https://honeylog.netlify.app/',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
  generateIndexSitemap: true,
};
