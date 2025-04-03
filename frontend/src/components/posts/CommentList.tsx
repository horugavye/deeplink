import React from 'react';
import Comment from './Comment';

interface CommentData {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
}

interface CommentListProps {
  comments: CommentData[];
  onLikeComment: (id: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onLikeComment }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
          content={comment.content}
          author={comment.author}
          createdAt={comment.createdAt}
          likes={comment.likes}
          onLike={onLikeComment}
        />
      ))}
    </div>
  );
};

export default CommentList; 