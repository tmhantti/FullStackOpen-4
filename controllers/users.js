const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  /* mikäli objekti ei sisällä kenttää 'username' tai 'password', 
     vastataan statuskoodilla 400 */ 
  if (username === undefined || password === undefined) 
    response.status(400).json({
        error: 'insert both username and password'
      }) 
  /* Yo. merkkijonojen pituus täytyy olla myös vähintään kolme, 
     muuten vastataan statuskoodilla 400 */   
  if (username.length < 3 || password.length < 3) 
    response.status(400).json({
        error: 'username and password must contain at least 3 characters'
      }) 
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })
  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })

  response.json(users)
})

module.exports = usersRouter