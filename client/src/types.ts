export interface Post {
  identifier: string;
  username: string;
  title: string;
  body?: string;
  slug: string;
  subName: string;
  createdAt: string;
  updatedAt: string;

  // virtual fields
  url: string;
}
