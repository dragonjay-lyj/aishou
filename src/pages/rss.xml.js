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
      description: post.data.description || '',
      link: `/artists/${artistId}/works/${workId}`,
      // works 特有的数据
      platform: post.data.platform,
      tier: post.data.tier,
      type: 'work'
    };
  });

  // 处理 gallery 条目
  const galleryItems = galleryEntries.map((post) => {
    return {
      title: post.data.title,
      pubDate: new Date(post.data.createdAt || new Date()),
      description: post.data.alt,
      link: `/gallery/${post.id.replace(/\.(mdx|md)$/, '')}`,
      // gallery 特有的数据
      artist: post.data.artist,
      source: post.data.source,
      type: 'gallery'
    };
  });

  // 合并所有条目并按日期排序
  const allItems = [...worksItems, ...galleryItems].sort((a, b) => 
    b.pubDate.getTime() - a.pubDate.getTime()
  );

  return rss({
    // RSS Feed 元数据
    title: 'Kemono',
    description: '一个小小的Kemono仿站',
    site: context.site,
    items: allItems.map(item => ({
      ...item,
      // 确保 pubDate 是 Date 对象
      pubDate: item.pubDate instanceof Date ? item.pubDate : new Date(item.pubDate),
      // 创建自定义的内容描述
      content: createItemContent(item),
    })),
    // 自定义 XML 命名空间（可选）
    customData: `
      <language>zh-cn</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    `
  });
}

// 创建 RSS 条目的详细内容
function createItemContent(item) {
  if (item.type === 'work') {
    return `
      <div>
        <h2>${item.title}</h2>
        <p>平台: ${item.platform}</p>
        ${item.tier ? `<p>等级: ${item.tier}</p>` : ''}
        <p>${item.description}</p>
      </div>
    `;
  } else {
    return `
      <div>
        <h2>${item.title}</h2>
        <p>作者: ${item.artist}</p>
        <p>来源: ${item.source}</p>
        <h3>分析</h3>
      </div>
    `;
  }
}