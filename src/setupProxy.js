const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/server',
    createProxyMiddleware({
      target: 'http://'+process.env.REACT_APP_SERVER_ADDRESS || 'http://0.0.0.0:8000',
      changeOrigin: true,
    })
  );
};