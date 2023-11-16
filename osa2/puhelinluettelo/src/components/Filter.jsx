const Filter = (props) => {
    return(
        <div>
            <div>filter shown with <input value={props.searchParam} onChange={props.handleSearchChange} /></div>
        </div>
    )
}

export default Filter