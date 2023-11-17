import { useState, useEffect } from 'react'
import countryService from './services/countries'

const ShowCountries = ({ countriesToShow, setCountry, country }) => {
  if (countriesToShow.length > 10) {
    return(
    <p>Too many matches</p>)
  }
  else if (countriesToShow.length > 1) {
    return(
      countriesToShow.map(country => <p key={country.name.common}>{country.name.common}</p>)
    )
  }
  else if (countriesToShow.length === 1) {
    const countryToShow = countriesToShow[0].name.common
    useEffect(() => {
      countryService
      .getOne(countryToShow)
      .then(response => {
        setCountry(response)
      })
    }, [countryToShow])
    
    if (country === null){
      return null
    }
    else{
      return(
        <div>
        <h1>{country.name.common}</h1>
        <div>capital {country.capital[0]}</div>
        <div>area {country.area}</div>
        <h3>languages</h3>
        <ul>
          {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
        </ul>
        <div>{country.flag}</div>
      </div>
      )
    } 
  }
}


function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(null)
  const [searchParam, setSearchParam] = useState('')

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearchParam(event.target.value)
  }

  const countriesToShow = searchParam === "" ? countries : countries.filter(el => 
    el.name.common.toLowerCase().indexOf(searchParam.toLowerCase()) !== -1)

  return (
    <div>
      <div>filter shown with <input value={searchParam} onChange={handleSearchChange} /></div>
      <ShowCountries countriesToShow={countriesToShow} setCountry={setCountry} country={country} />
    </div>
  )
}

export default App
