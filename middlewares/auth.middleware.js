const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  try {
    console.log('auth')
    // Obtain session cookie token
    const { token } = req.cookies
    const { id } = jwt.verify(token, process.env.JWT_KEY)

    if (id) {
      req.userId = id
      console.log('auth middleware', req.userId)
    } else {
      return res.status(401).json({ msg: 'Unauthorized user' })
    }
  } catch (err) {
    console.log('no token')
    return res.status(401).json({ err })
  }

  next()
}

module.exports = { auth }
