import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { RootState } from '../../store';
import { markAsRead, markAllAsRead } from '../../store/slices/notificationSlice';

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.notifications);

  const handleMarkAsRead = (notificationId: number) => {
    dispatch(markAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const getNotificationLink = (notification: any) => {
    switch (notification.notification_type) {
      case 'post_comment':
      case 'post_rating':
        return `/communities/post/${notification.target_id}`;
      case 'follow':
        return `/profile/${notification.sender?.username}`;
      case 'chat_message':
        return `/chat/${notification.target_id}`;
      case 'community_invite':
        return `/communities/${notification.target_id}`;
      default:
        return '#';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Notifications
          </h3>
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Mark all as read
          </button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No notifications
            </p>
          ) : (
            notifications.map((notification: any) => (
              <Link
                key={notification.id}
                to={getNotificationLink(notification)}
                className={`block p-4 rounded-md transition ${
                  notification.is_read
                    ? 'bg-gray-50 dark:bg-gray-700'
                    : 'bg-primary-50 dark:bg-primary-900'
                }`}
                onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start">
                  {notification.sender?.avatar ? (
                    <img
                      src={notification.sender.avatar}
                      alt={notification.sender.username}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600" />
                  )}
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(notification.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown; 