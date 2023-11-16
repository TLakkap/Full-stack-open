const Persons = (props) => {
    return(
        <div>
            {props.personsToShow.map(person =>
                <div key={person.name}>
                    {person.name} {person.number}
                    <button onClick={() => props.deleteName(person.id)}>delete</button>
                </div>
                )}
        </div>
    )
}

export default Persons