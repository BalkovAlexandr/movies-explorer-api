const { NODE_ENV, JWT_SECRET } = process.env

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const ConflictError = require('../errors/ConflictError')
const NotFoundError = require('../errors/NotFoundError')
const ValidationError = require('../errors/ValidationError')

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по заданному id отсутствует'))
    .then((user) => res.send(user))
    .catch(next)
}

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`))
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'))
      } else {
        next(err)
      }
    })
}

const createUser = (req, res, next) => {
  const { email, password, name } = req.body

  if (!password) {
    next(new ValidationError('Введите пароль'))
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, name, password: hash }))
    .then((user) => res.send(user.toJSON()))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`))
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'))
      } else {
        next(err)
      }
    })
}

const login = (req, res, next) => {
  const { email, password } = req.body

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' })
      res.cookie('token', token, { maxAge: 3600000 * 24 * 7 })
        .send({ token })
    })
    .catch(next)
}

const logout = (req, res) => {
  res.clearCookie('token').send({ message: 'Выход выполнен' });
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  login,
  logout,
}
