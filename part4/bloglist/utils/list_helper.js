const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum = sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const compareBlogs = (old, current) => {
    return current.likes > old.likes ? current : old
  }

  return blogs.length === 0
    ? {}
    : blogs.reduce(compareBlogs)
}

const mostBlogs = (blogs) => {
  const authorCount = lodash.countBy(blogs, (blog) => blog.author)

  const maxBlogs = (old, value, key) => {
    return old.blogs > value ? old : { author: key, blogs: value }
  }

  return blogs.length === 0
    ? {}
    : lodash.reduce(authorCount, maxBlogs, {})
}

const mostLikes = (blogs) => {
  const authors = lodash.groupBy(blogs, (blog) => blog.author)

  const countLikes = (old, value, key) => {
    const likes = value.reduce((sum, blog) => sum = sum + blog.likes, 0)

    return old.likes > likes ? old : { author: key, likes: likes }
  }

  return blogs.length === 0
    ? {}
    : lodash.reduce(authors, countLikes, {})
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
