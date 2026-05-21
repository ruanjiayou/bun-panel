/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope;

// 1. 立即激活与接管老客户端
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting(); // 对应原 skipWaiting: true
  }
});
// 如果希望全自动跳过等待，可以直接执行：
self.skipWaiting();
// 激活时立即声明控制权
self.addEventListener('activate', () => {
  self.clients.claim(); // 对应原 clientsClaim: true
});

// 2. 清理历史版本的过时缓存 (对应原 cleanupOutdatedCaches: true)
cleanupOutdatedCaches();

// 3. 预缓存静态资源 (Vite PWA 插件会自动将包含 globPatterns 文件的打包结果注入到下面这行)
precacheAndRoute(self.__WB_MANIFEST);

// ----------------------------------------------------
// 4. 运行时缓存逻辑 (Runtime Caching)
// ----------------------------------------------------

// 策略一：拦截 /gw 接口并过滤业务错误码
registerRoute(
  ({ url }) => url.pathname.startsWith('/gw'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          if (!response || response.status !== 200) {
            return null;
          }
          try {
            const clonedResponse = response.clone();
            const body = await clonedResponse.json();

            // 修改为你之前的逻辑：只要 code 不等于 0，一律拒绝缓存
            if (body && body.code !== 0) {
              console.log('业务错误码，拒绝写入 PWA 缓存');
              return null;
            }
          } catch (e) {
            // 无法解析为 JSON 的响应保持原样
          }
          return response;
        }
      }
    ]
  })
);

// 策略二：图片缓存 (StaleWhileRevalidate)
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 3600 * 12,
        maxEntries: 500, // 对应原配置 maxEntries
      }),
    ],
  })
);

/**
 * 监听后台推送事件 (Push)
 * 当服务器触发 Web Push 时，以下代码会在手机后台被唤醒执行
 */
self.addEventListener('push', function (event) {
  // 确保推送带有数据
  if (!event.data) {
    console.warn('收到了一条没有数据的空推送');
    return;
  }

  try {
    // 假设后端发过来的是 JSON 字符串
    const payload = event.data.json();

    const title = payload.title || '新消息提醒';
    const options: NotificationOptions & { renotify: boolean } = {
      body: payload.body || '您收到了一条通知。',
      icon: payload.icon || '/logo-192x192.png',       // 通知大图标
      badge: payload.badge || '/logo.jpg',        // 手机状态栏单色小图标
      // vibrate: [200, 100, 200],                        // 震动节奏 (仅限安卓)

      // actions 可以让通知带有交互按钮（选填）
      // actions: payload.actions || [
      //   { action: 'open', title: '点击查看' },
      //   { action: 'close', title: '忽略' }
      // ],

      // tag 相同的通知在手机通知栏会发生覆盖，防止叠了一大堆
      tag: payload.tag || 'default-tag',
      renotify: true, // 设置为 true 时，覆盖旧通知会再次震动/响铃

      // 核心：把自定义数据（如点击跳转路径）塞进 data，传给下面的点击事件使用
      data: {
        url: payload.url || '/',
        badgeCount: payload.badgeCount || 0
      }
    };

    // 告诉浏览器挂起 Service Worker 线程，直到成功展示通知
    event.waitUntil(
      (async () => {
        // 展示弹窗通知
        await self.registration.showNotification(title, options);

        // 如果后端传了角标数，顺便在桌面上设置应用红点（iOS16.4+ & 桌面端支持）
        if (payload.badgeCount !== undefined && 'setAppBadge' in navigator) {
          if (payload.badgeCount > 0) {
            await navigator.setAppBadge(payload.badgeCount);
          } else {
            await navigator.clearAppBadge();
          }
        }
      })()
    );

  } catch (err) {
    console.error('解析 Service Worker 推送数据失败，尝试文本展示:', err);
    // 降级处理：如果后端发的内容不是 JSON，按纯文本弹出
    event.waitUntil(
      self.registration.showNotification('新消息', {
        body: event.data.text()
      })
    );
  }
});

/**
 * 3. 监听通知点击事件 (Notification Click)
 * 用户点击通知栏、或者点击通知下方的按钮时触发
 */
self.addEventListener('notificationclick', function (event) {
  // 立刻关闭通知栏的弹窗
  event.notification.close();

  // 获取刚才在 push 事件里塞进去的自定义数据
  const notificationData = event.notification.data || {};
  const targetUrl = new URL(notificationData.url || '/', self.location.origin).href;

  // 如果用户点击的是“忽略”按钮
  if (event.action === 'close') {
    return;
  }

  // 统一执行：点击通知打开或唤醒应用窗口
  event.waitUntil(
    (async () => {
      // 1. 获取当前所有已经打开的该 PWA 窗口（Clients）
      const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

      // 2. 看看有没有现成的窗口已经停留在目标页面，有就直接“聚焦（Focus）”过去
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }

      // 3. 如果没找到，但在运行，就让其中一个窗口导航到新页面
      if (clientList.length > 0 && 'navigate' in clientList[0]!) {
        await clientList[0].focus();
        return clientList[0].navigate(targetUrl);
      }

      // 4. 如果应用彻底被杀了、一个窗口都没开，就直接新开窗口直达
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })()
  );
});

/**
 * 4. 监听通知关闭事件 (Notification Close)
 * 选填。用户没有点通知，而是轻轻滑掉（划走删除）了这条通知时触发，一般用于统计漏斗
 */
self.addEventListener('notificationclose', function (event) {
  console.log('用户滑掉了通知，未做任何处理');
  // 可在此处发送埋点请求
});