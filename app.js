const express = require('express')
const config = require('./utils/config')
const app = express()
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')


mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })


app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/bloglist/api/blogs', blogsRouter)
app.use('/bloglist/api/users', usersRouter) 

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app