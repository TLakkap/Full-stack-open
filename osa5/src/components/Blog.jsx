import { useState } from "react"

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [blogDetailsVisible, setBlogDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setBlogDetailsVisible(!blogDetailsVisible)
  }

  const hideWhenVisible = { display: blogDetailsVisible ? 'none' : '' }
  const showWhenVisible = { display: blogDetailsVisible ? '' : 'none' }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button style={hideWhenVisible} onClick={() => toggleDetails()}>view</button>
        <button style={showWhenVisible} onClick={() => toggleDetails()}>hide</button>
      </div>
      <div style={showWhenVisible}>
        <div>
          {blog.url}
        </div>
        <div>
          Likes {blog.likes}
          <button>like</button>
        </div>
        <div>
        {blog.user.name}
        </div>
      </div>
    </div>
  )
}

export default Blog