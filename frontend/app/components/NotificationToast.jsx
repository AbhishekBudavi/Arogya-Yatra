import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

/**
 * NotificationToast Component
 * Displays appointment status change notifications
 */
export function NotificationToast({ notification, onClose }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border border-green-200';
      case 'error':
        return 'bg-red-50 border border-red-200';
      case 'warning':
        return 'bg-yellow-50 border border-yellow-200';
      default:
        return 'bg-blue-50 border border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      default:
        return 'text-blue-800';
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-200 text-green-800';
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'completed':
        return 'bg-blue-200 text-blue-800';
      case 'cancelled':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-md rounded-lg shadow-lg p-4 ${getBackgroundColor()} ${getTextColor()} animate-in slide-in-from-bottom-4 duration-300 z-50`}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <h3 className="font-semibold">{notification.title}</h3>
          <p className="text-sm mt-1">{notification.message}</p>

          {/* Status transition display */}
          {notification.oldStatus && notification.newStatus && (
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className={`px-2 py-1 rounded ${getStatusColor(notification.oldStatus)}`}>
                {notification.oldStatus}
              </span>
              <span>→</span>
              <span className={`px-2 py-1 rounded ${getStatusColor(notification.newStatus)}`}>
                {notification.newStatus}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * NotificationsContainer Component
 * Displays all active notifications
 */
export function NotificationsContainer({ notifications, onClose }) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationToast
            notification={notification}
            onClose={() => onClose(notification.id)}
          />
        </div>
      ))}
    </div>
  );
}
