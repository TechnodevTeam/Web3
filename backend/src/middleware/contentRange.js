// middleware/contentRange.js
function contentRangeMiddleware(req, res, next) {
  const originalJson = res.json;
  res.json = function (data) {
    // Appliquer uniquement aux GET sur une collection (pas d'ID dans l'URL)
    if (req.method === 'GET' && !req.params.id && Array.isArray(data)) {
      const resourceName = req.baseUrl.replace(/^\//, '');
      const total = data.length;
      // Récupérer les paramètres de pagination _start et _end envoyés par React Admin
      const start = parseInt(req.query._start) || 0;
      const end = parseInt(req.query._end) || total;
      const rangeEnd = Math.min(end, total) - 1;
      res.set('Content-Range', `${resourceName} ${start}-${rangeEnd}/${total}`);
    }
    originalJson.call(this, data);
  };
  next();
}

module.exports = contentRangeMiddleware;