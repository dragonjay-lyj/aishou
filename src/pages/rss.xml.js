import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const artistEntries = await getCollection('artists');
  const worksEntries = await getCollection('works');
  
  return rss({
    title: 'Kemono',
    description: '一个小小的Kemono仿站',
    site: context.site,
    items: worksEntries.map((post) => {
      const artistId = post.data.artistId;
      const id = post.id;

      return {
        title: post.data.title,
        pubDate: post.data.publishDate,
        description: post.data.description,
        link: `/artists/${artistId}/works/${id}`, // 正确访问 service 和 slug
        ...post.data,
      };
    }),
  });
}
