require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const { errors } = require('celebrate')
const cors = require('cors')
const limiter = require('./utils/limiter')
const router = require('./routes')
const { requestLogger, errorLogger } = require('./middlewares/logger')
const handleErrors = require('./middlewares/error-handler')
const corsOption = require('./middlewares/cors')

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env

const app = express()

app.use(requestLogger)

app.use(limiter)

app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

mongoose.connect(MONGO_URL)

app.use(cors(corsOption))

app.use(router)

app.use(errorLogger)

app.use(errors())

app.use(handleErrors)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
