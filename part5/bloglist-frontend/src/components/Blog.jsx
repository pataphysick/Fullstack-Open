import { useState } from 'react'

const Blog = ({ blog }) => {
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

  const expanded = () => {
    return (
      <>
        <p>URL: {blog.url}</p>
        <p>Likes: {blog.likes} <button>Like</button></p>
      </>
    )
  }

  return(
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{view ? 'hide' : 'view'}</button>
      </div>
      {view ? expanded() : null}
    </div>
  )}

export default Blog
