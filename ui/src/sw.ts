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