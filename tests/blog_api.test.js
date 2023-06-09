const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

// tallennetaan testidata
beforeEach(async () => {
    await Blog.deleteMany({})  
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    // odotetaan, että tietokanta saadaan alustettua:
    await Promise.all(promiseArray)
  })

test('blogs are returned as json', async () => {
  await api
    .get('/bloglist/api/blogs') 
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('identifying field of created blog objects is named id', async () => {
    const response = await api.get('/bloglist/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
    // huom: seuraava ei kuulu alustettuun testidataan: 
    const newBlog =  {
      "title": "My Whisky Blog",
      "author": "Jack Daniels",
      "url": "https://new.net/whiskyblog",
      "likes": 4
      } 
  
    await api
      .post('/bloglist/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain('My Whisky Blog')    
  })
 
test('blog object always contains likes and its value is zero if not given', async () => {
    // Huom: kenttää 'likes' ei ole määritelty
    const newBlog =  {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        // likes: 2,
        __v: 0
      } 

    await api
      .post('/bloglist/api/blogs')
      .send(newBlog)
    const blogsAtEnd = await helper.blogsInDb()
    const insertedBlog= blogsAtEnd.at(-1)
    expect(insertedBlog.likes).toBeDefined()
    expect(insertedBlog.likes === 0)
})

test('blog object must contain fields title and url', async () => {
  // Huom: kenttää 'url' ei ole määritelty
  const newBlog =  {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      // url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    } 
  // Huom: kenttää 'title' ei ole määritelty
  const anotherBlog =  {
    _id: "5a422bc61b54a676234d17fc",
    // title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }   
  await api
    .post('/bloglist/api/blogs')
    .send(newBlog)
    .expect(400)

  await api
    .post('/bloglist/api/blogs')
    .send(anotherBlog)
    .expect(400)

})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/bloglist/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    blogsAtStart.length - 1
  )
  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).not.toContain(blogToDelete.title)
})

test('likes field of a blog can be updated', async () => {
  const blogs= await helper.blogsInDb()
  const blogToUpdate = blogs[0]
  const initLikes= blogToUpdate.likes
  // lisätään tykkäysten lukumäärää: 
  blogToUpdate.likes++
  await api 
    .put(`/bloglist/api/blogs/${blogToUpdate.id}`)
  const finalLikes= blogToUpdate.likes
  expect ( (finalLikes - initLikes) === 1)
})

afterAll(async () => {
  await mongoose.connection.close()
})