import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA, type ManifestOptions } from 'vite-plugin-pwa';
import { createHtmlPlugin } from 'vite-plugin-html';
import { compression } from 'vite-plugin-compression2';
import Obfuscator from 'vite-plugin-bundle-obfuscator';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import svgr from 'vite-plugin-svgr';
import wyw from '@wyw-in-js/vite';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const manifest: Partial<ManifestOptions> = {
    "short_name": env.APP_NAME,
    "name": env.APP_NAME,
    "id": "panel",
    "scope": "/",
    "lang": "zh-CN",
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
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
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
      ViteImageOptimizer({}),
      createHtmlPlugin({
        inject: {
          data: {
            APP_NAME: env.APP_NAME
          }
        }
      }),
      // 需nginx配置开启静态预压缩寻找
      // compression({
      //   algorithms: ['brotliCompress'],
      //   exclude: [/\.(br)$/, /\.(gz)$/]
      // }),
      // 
      // 混淆得丧心病狂了😭
      // Obfuscator({
      //   obfuscateWorker: true,
      //   threadPool: true,
      //   options: {
      //     // 🟢 关键 1：彻底关闭控制流平坦化（体积暴增的元凶！能省下 50% 空间）
      //     controlFlowFlattening: false,
      //     // 🟢 关键 2：彻底关闭死代码注入（直接杜绝无用垃圾代码）
      //     deadCodeInjection: false,
      //     // 🟢 关键 3：保留基础的变量/函数名混淆和字符串打乱（性价比最高）
      //     compact: true,
      //     identifierNamesGenerator: 'hexadecimal',

      //     stringArray: true,
      //     stringArrayEncoding: ['base64'], // 仅使用基础的 base64 加密字符串

      //     stringArrayThreshold: 0.5,       // 75% 的字符串进入加密池即可

      //     // 🟢 关键 4：如果你开了这个，千万不要开 selfDefending，否则代码会膨胀且无法压缩
      //     selfDefending: false,// 🟢 关键 5：排除第三方库（后面会详细讲）
      //     excludes: [
      //       '**/node_modules/**',
      //     ]
      //   },
      // }),
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
        '/gw/': {
          target: 'http://192.168.0.124',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/gw\/panel/, '')
        },
      }
    }
  }
});