const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })

  return response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {

  const user = request.user

  const blog = new Blog({...request.body, user: user.id })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {

  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (user.id.toString() === blog.user.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  else {
    return response.status(403).json({ error: 'User not authorized to delete blog'})
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = request.body

  const updatedBlog =  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter
