const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.listWithManyBlogs
                            .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  // Clear all users and set up new one for testing
  await User.deleteMany({})
  const user = {
    username: 'jjoyce',
    name: 'James Joyce',
    password: 'riverrun'
  }

  await api
    .post('/api/users')
    .send(user)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Login with new user and get token
  const response = await api
        .post('/api/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

  token = 'Bearer ' + response.body.token
})

test('Get correct number of notes', async () => {
  const response = await api.get('/api/blogs').set('Authorization', token)

  assert.strictEqual(response.body.length, helper.listWithManyBlogs.length)
})

test('Check id property', async () => {
  const response = await api.get('/api/blogs').set('Authorization', token)

  assert(response.body[0].id)
  assert(!response.body[0]._id)
})

test('Create new post', async () => {
  const newPost = {
    title: "Finnegans Wake",
    author: "James Joyce",
    url: "https://www.fadedpage.com/books/20180126/html.php",
    likes: 9001
  }

  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.listWithManyBlogs.length + 1)

  const contents = blogsAtEnd.map((blog) => blog.title)
  assert(contents.includes('Finnegans Wake'))
})

test('Default to zero likes if not specified', async () => {
  const newPost = {
    title: "Finnegans Wake",
    author: "James Joyce",
    url: "https://www.fadedpage.com/books/20180126/html.php",
  }

  const savedBlog = await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

  assert.strictEqual(savedBlog.body.likes, 0)
})

test('Return 400 if no title or url', async () => {
  const noTitle = {
    author: "James Joyce",
    url: "https://www.fadedpage.com/books/20180126/html.php",
    likes: 9001
  }
  const noUrl = {
    title: "Finnegans Wake",
    author: "James Joyce",
    likes: 9001
  }

 const response = await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(noTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(noUrl)
    .expect(400)

  const notesAtEnd = await helper.blogsInDb()
  assert.strictEqual(notesAtEnd.length, helper.listWithManyBlogs.length)
})

test('Can delete blog by id', async () => {
  // Create new post first since none of initial posts have user field
  const newPost = {
    title: "Finnegans Wake",
    author: "James Joyce",
    url: "https://www.fadedpage.com/books/20180126/html.php",
    likes: 9001
  }

  const response = await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)

  const blogsAtStart = await Blog.find({ user: response.body.user })
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', token)
    .expect(204)

  const blogsAtEnd = await Blog.find({ user: response.body.user })
  const titles = blogsAtEnd.map(blog => blog.title)
  assert(!titles.includes(blogToDelete.title))
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('Can update blog by id', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const newBlog = {
    ...blogToUpdate,
    title: 'Altered Title',
  }

  const updated = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', token)
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(blog => blog.title)

  assert(titles.includes('Altered Title'))
})

test('Returns 401 if no token provided', async () => {
  const newPost = {
    title: "Finnegans Wake",
    author: "James Joyce",
    url: "https://www.fadedpage.com/books/20180126/html.php",
    likes: 9001
  }

  const response = await api
        .post('/api/blogs')
        .send(newPost)
        .expect(401)
        .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(response.body, { error: 'Token invalid' })
})


after(async () => {
  await mongoose.connection.close()
})
