import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { fetchPost, likePost } from '../../store/slices/postSlice';
import { createComment, likeComment } from '../../store/slices/commentSlice';
import { Post } from '../../types/post';
import CommentList from './CommentList';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { currentPost, loading, error } = useSelector((state: RootState) => state.post);
  const { loading: commentLoading } = useSelector((state: RootState) => state.comments);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchPost(id));
    }
  }, [dispatch, id]);

  const handleLike = () => {
    if (id) {
      dispatch(likePost(id));
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && id) {
      await dispatch(createComment({ postId: id, content: comment.trim() }));
      setComment('');
    }
  };

  const handleLikeComment = (commentId: string) => {
    dispatch(likeComment(commentId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Post not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <img
            src={currentPost.author.avatar}
            alt={currentPost.author.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <span className="font-semibold">{currentPost.author.username}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(currentPost.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">{currentPost.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{currentPost.content}</p>
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={handleLike}
            className="flex items-center text-gray-500 hover:text-blue-500"
          >
            <svg
              className="w-5 h-5 mr-1"
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
            {currentPost.likes}
          </button>
          <span className="flex items-center text-gray-500">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {currentPost.comments.length}
          </span>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Write a comment..."
              disabled={commentLoading}
            />
            <button
              type="submit"
              disabled={commentLoading}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          <CommentList
            comments={currentPost.comments}
            onLikeComment={handleLikeComment}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 