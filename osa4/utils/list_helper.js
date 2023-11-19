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
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}