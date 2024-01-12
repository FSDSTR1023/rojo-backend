const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  try {
    // Obtain session cookie token
    const { token } = req.cookies
    const { userName, country, authorization } = jwt.verify(token, process.env.JWT_KEY)

    // Check authorization
    if (authorization && authorization === 'user') {
      next()
    } else {
      res.status(401).json({ msg: 'Unauthorized user' })
    }
  } catch (err) {
    res.status(401).json({ err })
  }
}

module.exports = { auth }
