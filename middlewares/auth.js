const { NODE_ENV, JWT_SECRET } = process.env
const jwt = require('jsonwebtoken')
const AuthError = require('../errors/AuthError')

const auth = (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    return next(new AuthError('Токен отсутствует или некорректен'))
  }

  let payload
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret')
  } catch (err) {
    next(new AuthError('Авторизация не пройдена'))
  }
  req.user = payload
  return next()
}

module.exports = auth
