const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  try {
    // Obtain session cookie token
    const { token } = req.cookies
    const { id } = jwt.verify(token, process.env.JWT_KEY)

    if (id) {
      req.userId = id
    } else {
      return res.status(401).json({ msg: 'Unauthorized user' })
    }
  } catch (err) {
    return res.status(401).json({ err })
  }

  next()
}

module.exports = { auth }
