const Movie = require('../models/movie')
const ForbiddenError = require('../errors/ForbiddenError')
const NotFoundError = require('../errors/NotFoundError')
const ValidationError = require('../errors/ValidationError')
const ConflictError = require('../errors/ConflictError')

const getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies.map((movie) => movie))
    })
    .catch(next)
}

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`))
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Данный фильм уже добавлен в избранное'))
      } else {
        next(err)
      }
    })
}

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Недостаточно прав для удаления')
      } else {
        return movie.remove()
          .then(() => res.send({ message: `Фильм  '${movie.nameRU}' удален из избранного` }))
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные id фильма'))
      } else {
        next(err)
      }
    })
}

module.exports = {
  getUserMovies,
  createMovie,
  deleteMovie,
}
