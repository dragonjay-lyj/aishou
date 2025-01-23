import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const worksEntries = await getCollection('works');
  const galleryEntries = await getCollection('gallery');

  const items = [];

  // 处理 worksEntries
  for (const post of worksEntries) {
    const artistId = post.id.split('/')[0];
    const workId = post.id.replace(`${artistId}/`, '').replace(/\.(mdx|md)$/, '');

    items.push({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description, // 使用 description
      link: `/artists/${artistId}/works/${workId}`,
      ...post.data,
    });
  }

  // 处理 galleryEntries
  for (const post of galleryEntries) {
    items.push({
      title: post.data.title,
      pubDate: post.data.createdAt, // 使用 createdAt 作为发布日期
      description: post.data.alt, // 使用 alt 作为描述
      link: `/gallery#${post.id}`, // 使用 /gallery 加上 # 和图片 ID 作为链接
      ...post.data,
    });
  }

  return rss({
    title: 'Kemono',
    description: '一个小小的Kemono仿站',
    site: context.site,
    items: items,
  });
}