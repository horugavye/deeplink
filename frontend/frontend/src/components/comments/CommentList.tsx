import { formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
  };
}

interface CommentListProps {
  comments: Comment[];
}

function CommentList({ comments }: CommentListProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (comments.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-4">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {comment.author.username}
            </span>
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
}

export default CommentList; 