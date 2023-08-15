import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

import { IPostListItem } from '@type/index';
import { getBeginningContent, getMarkdownSplit } from '@utils/string';

export async function GET() {
  const fs = require('fs');
  const fsPromises = require('fs').promises;
  const markdownNameList: string[] = fs.readdirSync('markdown');

  const promisedPostList = markdownNameList.reduce(async (acc: Promise<IPostListItem[]>, markdownName) => {
    const markdownFile = fs.readFileSync(`markdown/${markdownName}`, 'utf-8');
    const stats = await fsPromises.stat(`markdown/${markdownName}`);

    const { markdown, markdownInfo } = getMarkdownSplit(markdownFile);

    const createdAt = dayjs(markdownInfo['date']).format('YYYY-MM-DD HH:mm') ?? '';

    const promisedAcc = await acc;

    return Promise.resolve([
      ...promisedAcc,
      {
        id: stats.ino,
        markdownName: markdownName.replace('.md', ''),
        title: markdownInfo['title'] ?? '',
        content: getBeginningContent(markdown, 250),
        createdAt,
        thumbnail: markdownInfo['thumbnail'] ?? '',
      },
    ]);
  }, Promise.resolve([]));

  const postList = await Promise.resolve(promisedPostList);
  const sortedPostList = postList.sort((prevPost, nextPost) => (prevPost.createdAt > nextPost.createdAt ? -1 : 1));

  return NextResponse.json(sortedPostList);
}
