import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchPosts } from '../store/slices/postSlice';
import { fetchCommunities } from '../store/slices/communitySlice';
import PostCard from '../components/posts/PostCard';
import CommunityCard from '../components/communities/CommunityCard';

function Home() {
  const dispatch = useAppDispatch();
  const { posts, loading: postsLoading } = useSelector((state: RootState) => state.posts);
  const { communities, loading: communitiesLoading } = useSelector((state: RootState) => state.communities);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchCommunities());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Posts */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Latest Posts</h1>
            <Link
              to="/create-post"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Create Post
            </Link>
          </div>
          
          {postsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Communities */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Communities</h2>
              <Link
                to="/create-community"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Create New
              </Link>
            </div>
            
            {communitiesLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {communities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 