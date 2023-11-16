const Persons = (props) => {
    return(
        <div>
            {props.persons.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
        </div>
    )
}

export default Persons