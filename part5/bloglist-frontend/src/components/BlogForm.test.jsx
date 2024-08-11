import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('BlogForm updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')
  const button = screen.getByText('Create')

  await user.type(titleInput, 'Finnegans Wake')
  await user.type(authorInput, 'James Joyce')
  await user.type(urlInput, 'riverrun.org')
  await user.click(button)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Finnegans Wake')
  expect(createBlog.mock.calls[0][0].author).toBe('James Joyce')
  expect(createBlog.mock.calls[0][0].url).toBe('riverrun.org')
})
