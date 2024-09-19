import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector( state => {
        return state.filter === '' ? state.anecdotes : state.anecdotes.filter(a => a.content.toLowerCase().indexOf(state.filter.toLowerCase()) !== -1)
    })
    
    const dispatch = useDispatch()

    return(
        <>
        {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
            <div key={anecdote.id}>
                <div>
                {anecdote.content}
                </div>
                <div>
                has {anecdote.votes}
                <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
                </div>
            </div>
        )}
        </>
    )
}

export default AnecdoteList