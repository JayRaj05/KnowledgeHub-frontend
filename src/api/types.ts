export type ArticleCategory = 'TECH' | 'AI' | 'BACKEND' | 'FRONTEND' | 'DEVOPS' | 'OTHER';

export interface Article {
  id: number;
  title: string;
  summary: string | null;
  category: ArticleCategory;
  content: string;
  tags: string | null;
  authorUsername: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleRequestPayload {
  title: string;
  category: ArticleCategory;
  content: string;
  tags: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
}

