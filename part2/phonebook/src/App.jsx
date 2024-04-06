import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

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
          .then(returnedPerson => setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person)))
      }
    }
    else {
      const newPerson = { name: newName, number: newNumber}
      personService
        .create(newPerson)
        .then(response => setPersons(persons.concat(response)))
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
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add New</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
    </>
  )
}

export default App
