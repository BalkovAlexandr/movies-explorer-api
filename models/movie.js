const mongoose = require('mongoose')
const validator = require('validator')

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'counrty не может быть пустым'],
  },
  director: {
    type: String,
    required: [true, 'director не может быть пустым'],
  },
  duration: {
    type: Number,
    required: [true, 'duration не может быть пустым'],
  },
  year: {
    type: String,
    required: [true, 'year не может быть пустым'],
  },
  description: {
    type: String,
    required: [true, 'description не может быть пустым'],
  },
  image: {
    type: String,
    required: [true, 'image не может быть пустым'],
    validator: (v) => validator.isURL(v),
    message: 'Неверный формат ссылки на изображение',
  },
  trailer: {
    type: String,
    required: [true, 'trailer не может быть пустым'],
    validator: (v) => validator.isURL(v),
    message: 'Неверный формат ссылки на трейлер',
  },
  thumbnail: {
    type: String,
    required: [true, 'thumbnail не может быть пустым'],
    validator: (v) => validator.isURL(v),
    message: 'Неверный формат ссылки на изображение',
  },
  owner: {
    type: mongoose.ObjectId,
    required: [true, 'owner не может быть пустым'],
  },
  movieId: {
    type: Number,
    required: [true, 'movieId не может быть пустым'],
  },
  nameRU: {
    type: String,
    required: [true, 'nameRU не может быть пустым'],
  },
  nameEN: {
    type: String,
    required: [true, 'nameEN не может быть пустым'],
  },
})

movieSchema.index({ owner: 1, movieId: 1 }, { unique: true })

module.exports = mongoose.model('movie', movieSchema)
