export interface Blog {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  content: string; // raw HTML from server
  status: 'draft' | 'scheduled' | 'published';
  scheduledAt: string; // ISO date string e.g. "2026-02-27T10:00:00Z"
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  category?: string;
}

export interface BlogApiResponse {
  data: Blog[];
  total: number;
  page: number;
}
