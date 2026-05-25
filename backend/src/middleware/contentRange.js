function contentRangeMiddleware(req, res, next) {
  const originalJson = res.json;
  res.json = function (data) {
    if (req.method === 'GET' && !req.params.id && Array.isArray(data)) {
      const resource = req.baseUrl.replace(/^\//, '');
      const total = data.length;
      res.set('Content-Range', `${resource} 0-${total - 1}/${total}`);
    }
    originalJson.call(this, data);
  };
  next();
}
module.exports = contentRangeMiddleware;