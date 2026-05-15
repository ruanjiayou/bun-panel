import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA, type ManifestOptions } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import wyw from '@wyw-in-js/vite';
import path from 'path';
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const manifest: Partial<ManifestOptions> = {
    "short_name": "Panel",
    "name": "Panel",
    "icons": [
      {
        "src": "favicon.ico",
        "sizes": "64x64 32x32 24x24 16x16",
        "type": "image/x-icon"
      },
      {
        "src": "logo-192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "logo-512.png",
        "sizes": "512x512",
        "type": "image/png"
      },
      // {
      //   "src": "/images/logo.jpg",
      //   "sizes": "72x72",
      //   "type": "image/jpg",
      //   "purpose": "monochrome"
      // }
    ],
    "id": "panel",
    "scope": "/",
    "start_url": "/panel",
    "display": "fullscreen",
    "theme_color": "#333",
    "background_color": "wheat",
    "share_target": {
      action: '/gw/panel/upload',
      method: 'POST',
      "enctype": "multipart/form-data",
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
        files: [
          {
            "name": "image",        // 表单字段名
            "accept": ["image/jpeg", "image/png", ".jpg", ".png"]
          },
          {
            "name": "documents",
            "accept": ["text", "text/csv", ".csv"]
          }
        ]
      }
    },
    "launch_handler": { client_mode: "focus-existing" },

  }

  return {
    base: env.APP_SCOPE,
    plugins: [
      wyw({
        preserveCssPaths: true,
        transformLibraries: true,
        include: ['**/user-info/**/*.{ts,tsx,js,jsx}', './src/**/*.{ts,tsx,js,jsx}'],
        babelOptions: {
          presets: ['@babel/preset-typescript', '@babel/preset-react', '@linaria/babel-preset',],
        },
      }),
      react(),
      svgr(),
      VitePWA({
        workbox: {
          navigateFallback: null, // 禁止导航回退
          directoryIndex: null, // 防止 / 映射到 index.html
          globIgnores: ['**/index.html'],
          globPatterns: ['**/*.{js,css,ico,png,svg,jpg}'],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          runtimeCaching: [{
            urlPattern: ({ url }) => url.pathname.startsWith('/gw'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
            },
          }, {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 500,
              },
            },
          }]
        },
        registerType: 'autoUpdate',
        manifest,
        injectRegister: 'inline',
        strategies: 'generateSW',   // 使用注入模式
        devOptions: {
          enabled: true,      // 开发环境下启用 SW
          type: 'module',     // 使用 module 类型（仅 Chromium 内核）
        },
      }),
      // visualizer({
      //   open: true, // 构建完成后自动打开报告
      //   filename: 'stats.html', // 生成的分析文件名
      //   gzipSize: true, // 显示 gzip 后的压缩大小
      //   brotliSize: true, // 显示 brotli 后的压缩大小
      // }),
    ],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        // 将 @ 指向 src 目录
        '@': path.resolve(__dirname, './src'),
      },
      preserveSymlinks: true,
    },
    optimizeDeps: {
      // 强制预构建包含 Linaria 的依赖
      include: [
        'react-is',
        'classnames',
        '@linaria/core',
        '@linaria/react',
      ],
      exclude: ['user-info'],
    },
    build: {
      outDir: 'panel',
    },
    server: {
      host: true,
      port: 3060,
      allowedHosts: ['max.local', 'jiayou.work'],
      watch: {
        ignored: ['!**/node_modules/user-info/**']
      },
      proxy: {
        '/images': {
          target: 'https://jiayou.work',
          changeOrigin: true,
        },
        '/gw/panel': {
          target: 'https://jiayou.work',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/gw\/panel/, '')
        },
      }
    }
  }
});