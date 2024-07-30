import { notification } from "antd";
import { createContext, useContext } from "react";

const NotificationContext = createContext({ name: "Default" });

const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

// Define hooks for accessing context
export function useNotificationContext() {
  return useContext(NotificationContext);
}

export default NotificationProvider;
