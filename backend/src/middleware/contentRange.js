function contentRangeMiddleware(req, res, next) {
  const originalJson = res.json;

  res.json = function (data) {
    // ✅ uniquement pour GET sans paramètre d'ID ET si data est un tableau
    if (
      req.method === 'GET' &&
      !req.params.id &&
      Array.isArray(data)
    ) {
      const resource = req.baseUrl.replace(/^\//, '') || 'items';
      const total = data.length;
      const end = total === 0 ? 0 : total - 1;
      res.set('Content-Range', `${resource} 0-${end}/${total}`);
    }

    originalJson.call(this, data);
  };

  next();
}
module.exports = contentRangeMiddleware;