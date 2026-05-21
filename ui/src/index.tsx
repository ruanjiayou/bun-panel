import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { store } from './store';
import { User } from 'user-info';
import { subscribeUserToPush, unsubscribePush } from './utils/notification';

if ('permissions' in navigator) {
  navigator.permissions.query({ name: 'notifications' }).then((permissionStatus) => {
    store.permission_notification = permissionStatus.state === 'granted' ? true : false;
    // 监听用户手动修改权限的行为
    permissionStatus.onchange = () => {
      const isAllowed = permissionStatus.state === 'granted' ? true : false;
      if (User.isLogin) {
        if (isAllowed) {
          subscribeUserToPush()
        } else {
          unsubscribePush()
        }
      }
      store.permission_notification = isAllowed
    };
  });
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
