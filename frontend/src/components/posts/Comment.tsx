import React from 'react';
import { Link } from 'react-router-dom';

interface CommentProps {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  onLike: (id: string) => void;
}

const Comment: React.FC<CommentProps> = ({
  id,
  content,
  author,
  createdAt,
  likes,
  onLike,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center mb-2">
        <img
          src={author.avatar}
          alt={author.username}
          className="w-8 h-8 rounded-full mr-2"
        />
        <div>
          <Link
            to={`/profile/${author.username}`}
            className="font-semibold hover:text-blue-500"
          >
            {author.username}
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{content}</p>
      <div className="flex items-center">
        <button
          onClick={() => onLike(id)}
          className="flex items-center text-gray-500 hover:text-blue-500"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          {likes}
        </button>
      </div>
    </div>
  );
};

export default Comment; 