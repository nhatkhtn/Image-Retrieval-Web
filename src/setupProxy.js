const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/server',
    createProxyMiddleware({
      target: process.env.REACT_APP_SERVER_ADDRESS ? 'http://'+process.env.REACT_APP_SERVER_ADDRESS : 'http://127.0.0.1:8000/myapp',
      changeOrigin: true,
    })
  );
};