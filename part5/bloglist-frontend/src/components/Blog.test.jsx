import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Finnegans Wake',
  author: 'James Joyce',
  url: 'fw.com',
  likes: 9001,
  user: {name: 'jjoyce'}
}

test('Blog title and author rendered', () => {
  const { container } = render(<Blog blog={blog} />)

  const element = container.querySelector('.blog')
  expect(element).toHaveTextContent('Finnegans Wake James Joyce')
  expect(element).not.toHaveTextContent('URL: fw.com')
  expect(element).not.toHaveTextContent('Likes: 9001')
  expect(element).not.toHaveTextContent('User: jjoyce')
})

test('Clicking button shows hidden fields', async () => {
  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const element = container.querySelector('.blog')
  expect(element).toHaveTextContent('Finnegans Wake James Joyce')
  expect(element).toHaveTextContent('URL: fw.com')
  expect(element).toHaveTextContent('Likes: 9001')
  expect(element).toHaveTextContent('User: jjoyce')
})

test('Handler called when liking a post', async () => {
  const mockHandler = vi.fn()

  render(<Blog blog={blog} likePost={mockHandler} />)

  const user = userEvent.setup()
  const showButton = screen.getByText('view')
  await user.click(showButton)
  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
