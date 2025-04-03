import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { fetchPosts } from '../store/slices/postSlice';
import { fetchCommunities } from '../store/slices/communitySlice';
import { Post } from '../types/post';
import { Community } from '../types/community';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, loading: postsLoading, error: postsError } = useSelector((state: RootState) => state.post);
  const { communities, loading: communitiesLoading, error: communitiesError } = useSelector((state: RootState) => state.community);
  const [selectedTab, setSelectedTab] = useState<'posts' | 'communities'>('posts');

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchCommunities());
  }, [dispatch]);

  if (postsLoading || communitiesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (postsError || communitiesError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">
          {postsError || communitiesError}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to DeepLink</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedTab('posts')}
            className={`px-4 py-2 rounded-lg ${
              selectedTab === 'posts'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setSelectedTab('communities')}
            className={`px-4 py-2 rounded-lg ${
              selectedTab === 'communities'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Communities
          </button>
        </div>
      </div>

      {selectedTab === 'posts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: Post) => (
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
                    <Link
                      to={`/profile/${post.author.username}`}
                      className="font-semibold hover:text-blue-500"
                    >
                      {post.author.username}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
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
                  <Link
                    to={`/communities/${post.community.id}`}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    {post.community.name}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community: Community) => (
            <Link
              key={community.id}
              to={`/communities/${community.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={community.avatar}
                    alt={community.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h2 className="text-xl font-bold">{community.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {community.members} members
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {community.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {community.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 