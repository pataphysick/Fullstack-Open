import { useState } from 'react'

const Blog = ({ blog, likePost, deletePost, user }) => {
  const [view, setView] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setView(!view)
  }

  const handleLike = (event) => {
    event.preventDefault()
    const user = blog.user.id
    const likes = blog.likes + 1
    likePost({ ...blog, user: user, likes: likes })
  }

  const handleDelete = (event) => {
    event.preventDefault()
    if (window.confirm(`Delete blog "${blog.title}"?`)) {
      deletePost(blog)
    }
  }

  const deleteButton = () => {
    return (
      <button onClick={handleDelete}>Delete blog</button>
    )
  }

  const expanded = () => {
    return (
      <>
        <p>URL: {blog.url}</p>
        <p>Likes: {blog.likes} <button onClick={handleLike}>Like</button></p>
        <p>User: {blog.user.name}</p>
        {user.username === blog.user.username ? deleteButton() : null}
      </>
    )
  }

  return(
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{view ? 'hide' : 'view'}</button>
      </div>
      {view ? expanded() : null}
    </div>
  )}

export default Blog
