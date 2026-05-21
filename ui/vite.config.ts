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
    "short_name": "灯塔导航",
    "name": "灯塔导航",
    "id": "panel",
    "scope": "/",
    "start_url": "/panel",
    "display": "fullscreen",
    "theme_color": "#333",
    "background_color": "wheat",
    "icons": [
      {
        "src": "favicon.ico",
        "sizes": "32x32",
        "type": "image/x-icon",
        "purpose": "any maskable"
      },
      {
        "src": "logo-192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "logo-512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any"
      },
      // {
      //   "src": "/images/logo.jpg",
      //   "sizes": "72x72",
      //   "type": "image/jpg",
      //   "purpose": "monochrome"
      // }
    ],
    "screenshots": [],
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
    define: {
      'process.env.WEB_PUSH': JSON.stringify(env.WEB_PUSH),
    },
    plugins: [
      svgr(),
      wyw({
        preserveCssPaths: true,
        transformLibraries: true,
        include: ['**/user-info/**/*.{ts,tsx,js,jsx}', './src/**/*.{ts,tsx,js,jsx}'],
        babelOptions: {
          presets: ['@babel/preset-typescript', '@babel/preset-react', '@linaria/babel-preset',],
        },
      }),
      react(),
      VitePWA({
        manifest,
        strategies: 'injectManifest',   // 使用注入模式
        srcDir: 'src',
        filename: 'sw.ts',
        registerType: 'autoUpdate',
        injectManifest: {
          manifestTransforms: [],
          globIgnores: ['**/index.html'],
          globPatterns: ['**/*.{js,css,ico,png,svg,jpg}'],
          // 注意：navigateFallback 和 directoryIndex 在 injectManifest 模式下
          // 不再由 vite 配置，需要去 sw.ts 里控制（或者像你一样直接不配导航回退）
        },
        injectRegister: 'auto',
        devOptions: {
          enabled: false,      // 开发环境下启用 SW
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
          target: 'http://192.168.0.124',
          changeOrigin: true,
        },
        '/gw/panel': {
          target: 'http://192.168.0.124',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/gw\/panel/, '')
        },
      }
    }
  }
});