import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'
import ErrorMessage from './components/ErrorMessage'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchParam, setSearchParam] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const personsToShow = searchParam === "" ? persons : persons.filter(el => el.name.toLowerCase().indexOf(searchParam.toLowerCase()) !== -1)

  const handleSearchChange = (event) => {
    setSearchParam(event.target.value)
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
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const foundPerson = persons[nameExists]
        personService
          .update(foundPerson.id, nameObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== foundPerson.id ? person : returnedPerson))
            setNotification(`${newName} number updated`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)        
            }, 5000)
            setPersons(persons.filter(p => p.id !== foundPerson.id))
          })
      }
    }
    else {
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotification(`${newName} added`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const deleteName = (id, name) => {
    if(window.confirm(`Delete ${name} ?`)){
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification(`${name} deleted`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
        })
    }
  }

  return (
    <div>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />
      <h2>Phonebook</h2>
      <Filter searchParam={searchParam} handleSearchChange={handleSearchChange} />
      <h2>Add a new</h2>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deleteName={deleteName} />
    </div>
  )
}

export default App