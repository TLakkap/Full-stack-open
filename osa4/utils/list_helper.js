const _ = require('lodash');

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    let sum = 0
    for (let i=0; i < blogs.length; i++) {
        sum += blogs[i].likes
    }
    return sum
}

const favoriteBlog = (blogs) => {
    const blogWithMostLikes = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current);
    return blogWithMostLikes
}

const mostBlogs = (blogs) => {
    const groupedByAuthor = _.groupBy(blogs, 'author')
    
    const authorWithMostBlogs = _.maxBy(Object.keys(groupedByAuthor), author => {
        return groupedByAuthor[author].length
    })
      
    const mostBlogsCount = groupedByAuthor[authorWithMostBlogs].length
      
    return {
    author: authorWithMostBlogs,
    blogs: mostBlogsCount,
    }
}

const mostLikes = (blogs) => {
    const groupedByAuthor = _.groupBy(blogs, 'author')
    
    const authorWithMostLikes = _.maxBy(Object.keys(groupedByAuthor), author => {
        return _.sumBy(groupedByAuthor[author], 'likes')
    })
      
    const mostLikesCount = _.sumBy(groupedByAuthor[authorWithMostLikes], 'likes')
      
    return {
    author: authorWithMostLikes,
    likes: mostLikesCount
    }
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }