export interface IPostListItem {
  id: number;
  title: string;
  markdownName: string;
  createdAt: string;
  content: string;
  thumbnail: string;
}

export interface IPrevNextPost {
  markdownName: string;
  title: string;
}

export interface IPostDetail {
  id: number;
  title: string;
  createdAt: string;
  markdown: string;
  thumbnail: string;
  prevPost: IPrevNextPost;
  nextPost: IPrevNextPost;
}
