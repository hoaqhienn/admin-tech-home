import React, { createContext, useContext, useCallback, useState } from 'react';

interface NotificationContextType {
  showNotification: (options: NotificationOptions) => void;
  requestPermission: () => Promise<void>;
  permission: NotificationPermission;
}

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  onClick?: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
  requestPermission: async () => {},
  permission: 'default',
});

export const useNotification = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [permission, setPermission] = useState<NotificationPermission>(
    window.Notification?.permission || 'default',
  );

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }

    try {
      const permission = await window.Notification.requestPermission();
      setPermission(permission);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }, []);

  const showNotification = useCallback(
    ({ title, body, icon, onClick }: NotificationOptions) => {
      if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
        return;
      }

      if (permission !== 'granted') {
        requestPermission();
        return;
      }

      try {
        const notification = new Notification(title, {
          body,
          icon,
        });

        if (onClick) {
          notification.onclick = () => {
            notification.close();
            onClick();
          };
        }
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    },
    [permission, requestPermission],
  );

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        requestPermission,
        permission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
