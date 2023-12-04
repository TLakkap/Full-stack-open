const blogForm = ({
    addBlog,
    newTitle,
    setNewTitle,
    newAuthor,
    setNewAuthor,
    newUrl,
    setNewUrl
}) => (
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

export default blogForm