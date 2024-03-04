const logginCallRoute = (req, res, next) => {
  if (!!process.env.NODE_ENV && process.env.NODE_ENV !== 'test') {
    console.log(`Calling ${req.method} --> ${req.url}`)
  }
  next()
}

module.exports = {
  logginCallRoute,
}
