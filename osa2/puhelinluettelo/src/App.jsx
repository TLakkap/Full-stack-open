import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchParam, setSearchParam] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)

  const search = (param) => {
    if(param === ''){
      setFilteredPersons(persons);
    }else{
      let foundPersons = persons.filter(el => el.name.toLowerCase().indexOf(param.toLowerCase()) !== -1)
      setFilteredPersons(foundPersons);
    }
  }

  const handleSearchChange = (event) => {
    setSearchParam(event.target.value)
    search(event.target.value)
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    const nameExists = persons.findIndex(person => person.name === newName)

    if (nameExists !== -1 ){
      alert(`${newName} is already added to phonebook`)
    }
    else {
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
      setSearchParam('')
      search('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchParam={searchParam} handleSearchChange={handleSearchChange} />
      <h2>Add a new</h2>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} />
    </div>
  )
}

export default App