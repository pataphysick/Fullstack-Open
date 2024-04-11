import { useState, useEffect } from 'react'
import axios from 'axios'


const CountryList = ({countries, filterString}) => {
  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filterString.toLowerCase()))
  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter.</p>
  }
  else if (filteredCountries.length === 1) {
    return <CountryInfo country={filteredCountries[0]} />
  }
  else {
    return (
      <>
        {filteredCountries.map(country => <CountryLine key={country.cca2} country={country} />)}
      </>
    )
  }
}

const CountryLine = ({country}) => {
  const [show, setShow] = useState(false)
 return (
   <>
     <p>{country.name.common} <button onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button></p>
     {show ? <CountryInfo country={country} /> : null }
   </>
 )
}

const CountryInfo = ({country}) => {
  return (
    <>
      <h1>{country.name.common} {country.flag}</h1>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.keys(country.languages).map(key => <li key={key}>{country.languages[key]}</li>)}
      </ul>
    </>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [filterString, setFilterString] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const handleFilterChange = (event) => {
    setFilterString(event.target.value)
  }

  return (
    <>
      <p>Find countries:</p>
      <input value={filterString} onChange={handleFilterChange} />
      <CountryList countries={countries} filterString={filterString} />
    </>
  )
}

export default App
