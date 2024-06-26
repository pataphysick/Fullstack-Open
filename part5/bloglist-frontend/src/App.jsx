import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, error }) => {
  let classes = 'notification '
  if (message === '') {
    return null
  }
  else {
    return (
      <div className={classes.concat(error ? 'error' : 'noerror')}>{message}</div>
    )
  }
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationError, setNotificationError] = useState(false)

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Convenience function to handle notification timeout
  const notify = (message, error) => {
    setNotificationMessage(message)
    setNotificationError(error)
    setTimeout(() => {
      setNotificationMessage('')
      setNotificationError(false)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      notify(`Logged in as ${user.name}`, false)
    }
    catch (exception) {
      notify('Wrong username or password', true)
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreate = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }

    blogService
      .create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        notify(`New blog "${title}" by ${author} added`, false)
        setTitle('')
        setAuthor('')
        setURL('')
      })
  }

  if (user === null) {
    return (
      <div>
        <h2>Login to application</h2>
        <Notification message={notificationMessage} error={notificationError} />
        <form onSubmit={handleLogin}>
          <div>
            Username:
            <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
            Password:
            <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notificationMessage} error={notificationError} />
      <p>{user.name} logged in.</p>
      <button onClick={handleLogout}>Logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      <h2>Create New Blog</h2>
        <form onSubmit={handleCreate}>
          <div>
            Title:
            <input type="text" value={title} name="Title" onChange={({ target }) => setTitle(target.value)}/>
          </div>
          <div>
            Author:
            <input type="text" value={author} name="Author" onChange={({ target }) => setAuthor(target.value)}/>
          </div>
          <div>
            URL:
            <input type="text" value={url} name="URL" onChange={({ target }) => setURL(target.value)}/>
          </div>
          <button type="submit">Create</button>
        </form>
    </div>
  )
}

export default App
