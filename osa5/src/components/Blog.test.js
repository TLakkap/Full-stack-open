import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
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
    )
  })

  test('renders title and author', () => {
    const titleElement = screen.getByText('testititle', { exact: false })
    const authorElement = screen.getByText('testiauthor', { exact: false })

    expect(titleElement).toBeDefined()
    expect(authorElement).toBeDefined()
  })
})