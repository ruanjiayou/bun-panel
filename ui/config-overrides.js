const { overrideDevServer } = require('customize-cra');

module.exports = {
  devServer: overrideDevServer(config => {
    config.proxy = {
      '/api/': {
        target: 'http://127.0.0.1:5555',
        changeOrigin: true,
        headers: {
          'Content-Type': 'application/json'
        },
        // pathRewrite: { '^/api': '/' }
      },
      '/uploads/': {
        target: 'http://127.0.0.1:5555',
        changeOrigin: true,
        "headers": {
          "Content-Type": "image/*"
        }
      }
    }
    return config;
  })
}