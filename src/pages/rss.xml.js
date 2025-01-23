// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const worksEntries = await getCollection('works');
  const galleryEntries = await getCollection('gallery');

  // 处理 works 条目
  const worksItems = worksEntries.map((post) => {
    const fullWorkId = post.id;
    const artistId = fullWorkId.split('/')[0];
    const workId = fullWorkId.replace(`${artistId}/`, '').replace(/\.(mdx|md)$/, '');

    return {
      title: post.data.title,
      pubDate: new Date(post.data.publishDate),
      description: '', // 这里先设置为空，后面会用 gallery 的描述
      link: `/artists/${artistId}/works/${workId}`,
      ...post.data,
    };
  });

  // 处理 gallery 条目，只获取 alt 作为描述
  const galleryDescriptions = galleryEntries.reduce((acc, post) => {
    acc[post.id] = post.data.alt;
    return acc;
  }, {});

  // 合并数据，使用 gallery 的描述
  const allItems = worksItems.map(item => ({
    ...item,
    description: galleryDescriptions[item.id] || item.description || '',
  }));

  return rss({
    title: 'Kemono',
    description: '一个小小的Kemono仿站',
    site: context.site,
    items: allItems,
  });
}