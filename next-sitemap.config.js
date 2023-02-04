/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_URL || 'https://honeylog.netlify.app',
  generateRobotsTxt: true,
};
