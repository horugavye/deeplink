export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface Community {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  likes: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  community: Community;
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
} 