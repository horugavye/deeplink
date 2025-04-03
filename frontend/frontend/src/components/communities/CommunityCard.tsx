import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { joinCommunity, leaveCommunity } from '../../store/slices/communitySlice';

interface Community {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  isJoined: boolean;
}

interface CommunityCardProps {
  community: Community;
}

function CommunityCard({ community }: CommunityCardProps) {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleJoinClick = () => {
    if (!user) return;
    if (community.isJoined) {
      dispatch(leaveCommunity(community.id));
    } else {
      dispatch(joinCommunity(community.id));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <Link to={`/communities/${community.id}`} className="block group">
        <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
          {community.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {community.description}
        </p>
      </Link>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {community.membersCount} members
        </span>
        <button
          onClick={handleJoinClick}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            community.isJoined
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {community.isJoined ? 'Leave' : 'Join'}
        </button>
      </div>
    </div>
  );
}

export default CommunityCard; 