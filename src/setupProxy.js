const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://139.59.89.212:5000/',
      changeOrigin: true,
    })
  );
};
