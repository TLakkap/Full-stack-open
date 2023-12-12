import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)

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

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }
    return(
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>create new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm 
            createBlog={createBlog}
          />
         <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const createBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
      setBlogFormVisible(false)
      setNotification(`A new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
          setNotification(null)
      }, 5000)
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