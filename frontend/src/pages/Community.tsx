import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../store';
import { fetchCommunity, joinCommunity } from '../store/slices/communitySlice';
import { fetchCommunityPosts } from '../store/slices/postSlice';
import { Post } from '../types/post';
import { Community as CommunityType } from '../types/community';

const Community: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { currentCommunity, loading: communityLoading, error: communityError } = useSelector(
    (state: RootState) => state.community
  );
  const { communityPosts, loading: postsLoading, error: postsError } = useSelector(
    (state: RootState) => state.post
  );
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchCommunity(id));
      dispatch(fetchCommunityPosts(id));
    }
  }, [dispatch, id]);

  if (communityLoading || postsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (communityError || postsError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">
          {communityError || postsError}
        </div>
      </div>
    );
  }

  if (!currentCommunity) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Community not found</div>
      </div>
    );
  }

  const handleJoinCommunity = () => {
    dispatch(joinCommunity(currentCommunity.id));
    setIsMember(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <img
            src={currentCommunity.avatar}
            alt={currentCommunity.name}
            className="w-20 h-20 rounded-full mr-6"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{currentCommunity.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {currentCommunity.description}
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500 dark:text-gray-400">
                {currentCommunity.members} members
              </span>
              <div className="flex flex-wrap gap-2">
                {currentCommunity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {!isMember && (
            <button
              onClick={handleJoinCommunity}
              className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Join Community
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communityPosts.map((post: Post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <span className="font-semibold">{post.author.username}</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {post.content}
              </p>
              <div className="flex items-center space-x-4">
                <button className="flex items-center text-gray-500 hover:text-blue-500">
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
                  {post.likes}
                </button>
                <button className="flex items-center text-gray-500 hover:text-blue-500">
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
                  {post.comments}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community; 