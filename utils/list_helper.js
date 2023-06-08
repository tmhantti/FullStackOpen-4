const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let totLikes = 0
    if (blogs.length > 0 ) { 
        totLikes= 
        blogs.reduce((totLikes, curBlog) =>
            totLikes + curBlog.likes,
            0)
    }
    return (totLikes)
}

const favoriteBlog = (blogs) => {
    let favBlog =  {}
    let maxLikes = 0
    blogs.forEach(blog => {
        if (blog.likes > maxLikes) {
            maxLikes = blog.likes
            favBlog = blog
        }
    })
    return (favBlog)
}

const mostBlogs = (blogs) => {
    let blogAuthor = ""
    let maxNoBlogs = 0
    // dictionary: key - author, value - number of blogs
    let blogDict = {};
    blogs.forEach(blog => {
        const author= blog.author
        if (author in blogDict) {
            blogDict[author]++                
        }
        else {
            blogDict[author]= 1
        }
        if (blogDict[author] > maxNoBlogs) {
            blogAuthor= author
            maxNoBlogs = blogDict[author]
        }
    })
    return(
        {"author": blogAuthor,
         "blogs": maxNoBlogs})  
}

const mostLikes = (blogs) => {
    let blogAuthor = ""
    let maxLikes = 0
    // dictionary: key - author, value - total number of likes
    let blogDict = {};
    blogs.forEach(blog => {
        const author= blog.author
        const likes = blog.likes
        if (author in blogDict) {
            blogDict[author]= blogDict[author] + likes               
        }
        else {
            blogDict[author]= likes
        }
        if (blogDict[author] > maxLikes) {
            blogAuthor= author
            maxLikes= blogDict[author]
        }
    })
    return(
        {"author": blogAuthor,
         "likes": maxLikes})  
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}