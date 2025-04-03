import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ChatBubbleLeftIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchPostById, likePost, unlikePost } from '../../store/slices/postSlice';
import { fetchComments, createComment } from '../../store/slices/commentSlice';
import CommentList from '../comments/CommentList';

function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentPost, loading: postLoading, error: postError } = useSelector(
    (state: RootState) => state.posts
  );
  const { comments, loading: commentsLoading, error: commentsError } = useSelector(
    (state: RootState) => state.comments
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
      dispatch(fetchComments(id));
    }
  }, [dispatch, id]);

  const handleLikeClick = () => {
    if (!user) return;
    if (!currentPost) return;

    if (currentPost.isLiked) {
      dispatch(unlikePost(currentPost.id));
    } else {
      dispatch(likePost(currentPost.id));
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!currentPost) return;

    try {
      await dispatch(
        createComment({ postId: currentPost.id, content: comment })
      ).unwrap();
      setComment('');
      setCommentError('');
    } catch (err) {
      setCommentError('Failed to add comment. Please try again.');
    }
  };

  if (postLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (postError || !currentPost) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-red-600 dark:text-red-400">
          {postError || 'Post not found'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center space-x-2 mb-2">
        <button
          onClick={() => navigate(`/communities/${currentPost.community.id}`)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {currentPost.community.name}
        </button>
        <span className="text-gray-500 dark:text-gray-400">•</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Posted by {currentPost.author.username}{' '}
          {formatDistanceToNow(new Date(currentPost.createdAt), { addSuffix: true })}
        </span>
      </div>

      <h1 className="text-2xl font-semibold mb-4">{currentPost.title}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-wrap">
        {currentPost.content}
      </p>

      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={handleLikeClick}
          className={`flex items-center space-x-1 ${
            currentPost.isLiked
              ? 'text-red-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-red-600'
          }`}
        >
          {currentPost.isLiked ? (
            <HeartIconSolid className="h-5 w-5" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span>{currentPost.likes}</span>
        </button>

        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
          <ChatBubbleLeftIcon className="h-5 w-5" />
          <span>{currentPost.comments}</span>
        </div>
      </div>

      {user && (
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <div className="mb-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          {commentError && (
            <p className="text-red-600 dark:text-red-400 mb-2">{commentError}</p>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Comment
          </button>
        </form>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {commentsLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : commentsError ? (
          <p className="text-red-600 dark:text-red-400">{commentsError}</p>
        ) : (
          <CommentList comments={comments} />
        )}
      </div>
    </div>
  );
}

export default PostDetail; 