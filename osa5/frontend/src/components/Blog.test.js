import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const dummyUpdateBlog = jest.fn()
  const dummyDeleteBlog = jest.fn()
  const dummyLoggedUser = { username: 'testuser', name: 'Test User' }

  let container

  const blog = {
    title: 'testititle',
    author: 'testiauthor',
    url: 'testiurl',
    likes: 9,
    user: {
      username: 'test',
      name: 'testuser'
    }
  }

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        updateBlog={dummyUpdateBlog}
        deleteBlog={dummyDeleteBlog}
        loggedUser={dummyLoggedUser}
      />
    ).container
  })

  test('renders title and author', () => {
    const titleElement = screen.getByText('testititle', { exact: false })
    const authorElement = screen.getByText('testiauthor', { exact: false })

    expect(titleElement).toBeDefined()
    expect(authorElement).toBeDefined()
  })

  test('clicking the view button renders url, likes and user', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.togglable')
    expect(div).not.toHaveStyle('display: none')
  })

  test('clicking the like button twice updateLikes is called twice', async () => {
    const user = userEvent.setup()
    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(dummyUpdateBlog.mock.calls).toHaveLength(2)
  })
})