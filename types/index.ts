export interface IPostListItem extends IMarkdownInfo {
  id: number;
  createdAt: string;
  content: string;
  thumbnail: string;
}

export interface IPostDetail {
  id: number;
  title: string;
  createdAt: string;
  markdown: string;
  thumbnail: string;
  prevPost: IMarkdownInfo;
  nextPost: IMarkdownInfo;
}

export interface IMarkdownInfo {
  markdownName: string;
  title: string;
}
