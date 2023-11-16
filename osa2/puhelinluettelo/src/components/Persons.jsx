const Persons = (props) => {
    return(
        <div>
            {props.personsToShow.map(person =>
                <div key={person.name}>
                    {person.name} {person.number}
                    <button onClick={() => props.deleteName(person.id, person.name)}>delete</button>
                </div>
                )}
        </div>
    )
}

export default Persons