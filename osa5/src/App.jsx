import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {    
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')    
    if (loggedUserJSON) {      
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)
      blogService.setToken(user.token)
    }  
  }, [])

  const handleLogin = async (event) => {    
    event.preventDefault()    
    try {    
      const user = await loginService.login({        
        username, password,      
      })
      window.localStorage.setItem(        
        'loggedNoteappUser',
        JSON.stringify(user)      
      )
      blogService.setToken(user.token)
      setUser(user)      
      setUsername('')      
      setPassword('')    
    } 
    catch (exception) {      
      setNotification('wrong username or password')      
      setTimeout(() => {        
        setNotification(null)      
      }, 5000)    
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotification(`A new blog ${newTitle} by ${newAuthor} added`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })
  }

  const loginForm = () => (
    <>
    <h2>Login</h2>
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
    </>
  )

  const blogForm = () => (
    <>
    <h2>create new</h2>
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
    </>
  )

  const showBlogs = () => {
    return(
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
        )}
      </div>
  )}

  return (
    <div>
      <Notification message={notification} />
      {!user && loginForm()} 
      {user && <div>
       <p>{user.name} logged in</p>
       <button onClick={logout}>Log out</button>
         {blogForm()}
         {showBlogs()}
      </div>
    } 


      
    </div>
  )
}

export default App