import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'
import personService from './services/persons'

const Notification = ({message, messageClass}) => {
  if (message === null) {
    return null
  }
  return (
    <div className={messageClass}>{message}</div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageClass, setMessageClass] = useState('error')

  const timeout = () => setTimeout(() => {
    setMessage(null)
    setMessageClass('error')
  }, 5000)

  const errorMessage = (name) => {
    setMessage(`Information of ${name} has already been removed from server.`)
    setMessageClass('error')
    timeout()
  }

  const successMessage = (name) => {
    setMessage(`Added ${name}.`)
    setMessageClass('success')
    timeout()
  }

  const hook = () => {
    personService
      .getAll()
      .then(response => setPersons(response))
  }

  useEffect(hook, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }


  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace old number with a new one?`)) {
        personService
          .update(existingPerson.id, { ...existingPerson, number: newNumber})
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person))
            successMessage(returnedPerson.name)
          })
          .catch(error => errorMessage(existingPerson.name))
      }
    }
    else {
      const newPerson = { name: newName, number: newNumber}
      personService
        .create(newPerson)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson))
          successMessage(createdPerson.name)
        })
        .catch(error => {
          setMessage(error.response.data.error)
          setMessageClass('error')
          timeout()
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {
    const deleteName = persons.find(person => person.id === id).name
    const confirm = window.confirm(`Delete ${deleteName}?`)
    if (confirm) {
      personService
        .deletePerson(id)
        .then(returnedPerson => {setPersons(persons.filter(person => person.id != returnedPerson.id))} )
    }
  }

  return (
    <>
      <h2>Phonebook</h2>
      <Notification messageClass={messageClass} message={message} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add New</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
    </>
  )
}

export default App
