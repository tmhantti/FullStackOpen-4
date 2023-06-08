const blogsRouter = require('express').Router()
const Blog= require('../models/blog')

blogsRouter.get('/', async (request, response) => { 
    const blogs = await Blog.find({})
    response.json(blogs)
  })

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  /* mikäli objekti ei sisällä kenttää 'url' tai 'title', 
     vastataan statuskoodilla 400 */ 
  if (blog.title === undefined || blog.url === undefined) 
    response.status(400).end()    

  /* lisätään objektiin kenttä 'likes' ja asetetaan sen arvo nollaksi,
  /  mikäli sitä ei ole annettu */
  if (blog.likes === undefined) 
    blog.likes = 0

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  })

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.end()
})

module.exports = blogsRouter