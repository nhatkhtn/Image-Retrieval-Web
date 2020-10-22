const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/server',
    createProxyMiddleware({
      target: process.env.REACT_APP_SERVER_ADDRESS ? 'http://'+process.env.REACT_APP_SERVER_ADDRESS : 'http://128.199.232.130:8000/',
      changeOrigin: true,
    })
  );
};