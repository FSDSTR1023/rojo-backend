function filters(req, res, next) {
  const { author } = req.query
  res.filters = { ...(author && { author }) }
  next()
}

module.exports = { filters }
