const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.listWithManyBlogs
        .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('Get correct number of notes', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.listWithManyBlogs.length)
})

test('Check id property', async () => {
  const response = await api.get('/api/blogs')

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
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.listWithManyBlogs.length + 1)

  const contents = blogsAtEnd.map((blog) => blog.title)
  assert(contents.includes('Finnegans Wake'))
})

after(async () => {
  await mongoose.connection.close()
})
