const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
}, 15000)

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('_id is transformed to id', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body[0].id)
})

test('a valid blog can be added', async () => {
    const login = await api.post('/api/login').send({username: 'root', password: 'sekret'})
    const token = login._body.token
    
    const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    }

    await api
    .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes(
        'Canonical string reduction'
    ))
})

test(`adding a blog with likes undefined, likes are saved as 0`, async () => {
    const login = await api.post('/api/login').send({username: 'root', password: 'sekret'})
    const token = login._body.token

    const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"
    }

    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog)
    assert.strictEqual(response.body.likes, 0)
})

test('a blog without title can not be added', async () => {
    const newBlog = {
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('a blog without url can not be added', async () => {
    const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('a blog can be deleted', async () => {
    const login = await api.post('/api/login').send({username: 'root', password: 'sekret'})
    const token = login._body.token

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api.delete(`/api/blogs/${blogToDelete.id}`, {headers: {Authorization: `Bearer ${token}`}}).expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
  
    const titles = blogsAtEnd.map(b => b.title)
  
    expect(titles).not.toContain(blogToDelete.title)
  })

test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedInfo = {
        title: blogsAtStart[0].title,
        author: blogsAtStart[0].author,
        url: blogsAtStart[0].url,
        likes: 12
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedInfo)
        .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd[0].likes).toBe(12)
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'akuankka',
        name: 'Aku Ankka',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('expected `username` to be unique')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })

    test('creation fails with proper statuscode and message if password too short', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'new',
          name: 'user',
          password: 'sa',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('password too short')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })

    test('creation fails with proper statuscode and message if username too short', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'ne',
          name: 'user',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('username too short')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })
    test('creation fails with proper statuscode and message if username is missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'user',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username is missing')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('creation fails with proper statuscode and message if password is missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'nimi',
            name: 'user',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password is missing')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})
after(async () => {
  await mongoose.connection.close()
})