const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  // Check if trying to login
  if (req.path === '/user/login') return next()

  try {
    // Obtain session cookie token
    const { token } = req.cookies
    const { userName, country, authorization } = jwt.verify(token, process.env.JWT_KEY)
    console.log(userName, country, authorization)

    // Check authorization
    if (authorization && authorization === 'user') {
      console.log(`User ${userName} from ${country} authorized`)
      next()
    } else {
      res.status(401).json({ msg: 'Unauthorized user' })
    }
  } catch (err) {
    res.status(401).json({ err })
  }
}

module.exports = { auth }
