import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return(
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input type="text" value={newTitle} name="Title" onChange={event => setNewTitle(event.target.value)} id='title-input' />
        </div>
        <div>
          Author:
          <input type="text" value={newAuthor} name="Author" onChange={event => setNewAuthor(event.target.value)} id='author-input' />
        </div>
        <div>
          URL:
          <input type="text" value={newUrl} name="URL" onChange={event => setNewUrl(event.target.value)} id='url-input' />
        </div>
        <button type="submit">Create</button>
      </form>

    </div>
  )
}

export default BlogForm
