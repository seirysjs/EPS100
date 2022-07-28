module.exports = {
  devServer: {
    port: 3333,
    proxy: {
      '^/api': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
      },
    },
  },
};
