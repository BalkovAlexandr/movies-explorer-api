const ERROR_CODE_BAD_REQUEST = 400
const ERROR_CODE_UNAUTHORIZED = 401
const ERROR_CODE_FORBIDDEN = 403
const ERROR_CODE_NOT_FOUND = 404
const ERROR_CODE_CONFLICT = 409
const ERROR_CODE_INTERNAL_SERVER_ERROR = 500

const CORS_WHITELIST = [
  'http://localhost:3001',
  'http://localhost:3000',
  'http://balkov.movies.nomoredomains.work',
  'https://balkov.movies.nomoredomains.work',
]

module.exports = {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_UNAUTHORIZED,
  ERROR_CODE_FORBIDDEN,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_CONFLICT,
  ERROR_CODE_INTERNAL_SERVER_ERROR,
  CORS_WHITELIST,
}
