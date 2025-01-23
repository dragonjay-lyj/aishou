import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const worksEntries = await getCollection('works');
  const galleryEntries = await getCollection('gallery');
  const allItems = [...worksEntries, ...galleryEntries];

  return rss({
    title: 'Kemono',
    description: '一个小小的Kemono仿站',
    site: context.site,
    items: allItems.map((post) => {
      // 从 post.id 中提取 artistId 和 workId
      const fullWorkId = post.id; // post.id 包含了 artistId 和 workId，例如 "artist-name/work-name.mdx"
      const artistId = fullWorkId.split('/')[0]; // artistId 是 id 的第一部分，例如 "artist-name"
      const workId = fullWorkId.replace(`${artistId}/`, '').replace(/\.(mdx|md)$/, ''); // 移除 artistId 前缀和扩展名，例如 "work-name"

      return {
        title: post.data.title,
        pubDate: post.data.publishDate,
        description: post.data.alt,
        link: `/artists/${artistId}/works/${workId}`, // 正确访问 service 和 slug
        ...post.data,
      };
    }),
  });
}