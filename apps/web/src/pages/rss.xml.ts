import { getCollection } from 'astro:content';
import { BLOG_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/constants';
import { filterVisibleContent, getContentDisplayTitle } from '../lib/content';

export async function GET() {
  const posts = filterVisibleContent(await getCollection('blog'));
  const allItems = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const itemsXml = allItems
    .map((item) => {
      const link = item.data.canonicalUrl;
      return `
    <item>
      <title><![CDATA[${getContentDisplayTitle(item)}]]></title>
      <description><![CDATA[${item.data.excerpt}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(item.data.pubDate).toUTCString()}</pubDate>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${BLOG_DESCRIPTION}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
