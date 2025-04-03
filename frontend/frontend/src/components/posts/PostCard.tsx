import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ChatBubbleLeftIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { likePost, unlikePost } from '../../store/slices/postSlice';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
  };
  community: {
    id: string;
    name: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLikeClick = () => {
    if (!user) return;
    if (post.isLiked) {
      dispatch(unlikePost(post.id));
    } else {
      dispatch(likePost(post.id));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center space-x-2 mb-2">
        <Link
          to={`/communities/${post.community.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {post.community.name}
        </Link>
        <span className="text-gray-500 dark:text-gray-400">•</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Posted by {post.author.username}{' '}
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </span>
      </div>

      <Link to={`/posts/${post.id}`} className="block group">
        <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
          {post.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.content}
        </p>
      </Link>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleLikeClick}
          className={`flex items-center space-x-1 ${
            post.isLiked
              ? 'text-red-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-red-600'
          }`}
        >
          {post.isLiked ? (
            <HeartIconSolid className="h-5 w-5" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span>{post.likes}</span>
        </button>

        <Link
          to={`/posts/${post.id}`}
          className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600"
        >
          <ChatBubbleLeftIcon className="h-5 w-5" />
          <span>{post.comments}</span>
        </Link>
      </div>
    </div>
  );
}

export default PostCard; 