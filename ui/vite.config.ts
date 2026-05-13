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
      }
    ],
    "id": "panel",
    "scope": "/",
    "start_url": "/panel",
    "display": "fullscreen",
    "theme_color": "#000000",
    "background_color": "#ffffff"
  }

  return {
    base: env.APP_SCOPE,
    plugins: [
      wyw({
        preserveCssPaths: true,
        transformLibraries: true,
        include: [/node_modules\/user-info/, './src/**/*.{ts,tsx,js,jsx}'],
        babelOptions: {
          presets: ['@babel/preset-typescript', '@babel/preset-react', '@linaria/babel-preset',],
        },
      }),
      react(),
      svgr(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest,
        injectRegister: 'inline',
        strategies: 'generateSW',   // 使用注入模式
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,ico,jpg,png,svg}'],
        },
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
    },
    optimizeDeps: {
      // 强制预构建包含 Linaria 的依赖
      include: [
        'user-info',
        'react-is',
        'classnames',
        '@linaria/core', '@linaria/react'],
    },
    build: {
      outDir: 'panel',
    },
    server: {
      host: true,
      port: 3060,
      allowedHosts: ['max.local', 'jiayou.work'],
      proxy: {
        '/images': {
          target: 'http://localhost:5555',
          changeOrigin: true,
        },
        '/gw/panel': {
          target: 'http://localhost:5555',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/gw\/panel/, '')
        },
      }
    }
  }
});