const _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let likes = 0
    for (let i=0; i < blogs.length; i++) {
        likes += blogs[i].likes
    }
    return likes
}

const favoriteBlog = (blogs) => {
    const maxLikes = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current);
    return maxLikes
}

const mostBlogs = (blogs) => {
    const groupedByAuthor = _.groupBy(blogs, 'author')
    
    const authorWithMostBlogs = _.maxBy(Object.keys(groupedByAuthor), author => {
        return groupedByAuthor[author].length;
    });
      
    const mostBlogsCount = groupedByAuthor[authorWithMostBlogs].length
      
    return {
    author: authorWithMostBlogs,
    blogs: mostBlogsCount,
    }
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}