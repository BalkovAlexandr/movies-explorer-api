const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const AuthError = require('../errors/AuthError')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email не может быть пустым'],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неверный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'password не может быть пустым'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'name не может быть пустым'],
    minlength: 2,
    maxlength: 30,
  },
})

userSchema.methods.toJSON = function noShowPassword() {
  const obj = this.toObject()
  delete obj.password
  return obj
}

userSchema.statics.findUserByCredentials = function checkAuth(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Введён неверный логин или пароль'))
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Введён неверный логин или пароль'))
          }
          return user
        })
    })
}

module.exports = mongoose.model('user', userSchema)
