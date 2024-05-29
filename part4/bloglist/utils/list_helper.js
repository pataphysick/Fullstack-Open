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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
