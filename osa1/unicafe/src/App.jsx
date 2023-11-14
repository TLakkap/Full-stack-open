import { useState } from 'react'

const StatisticLine = (props) => (
  <p>{props.text} {props.value}</p>
)

const Statistics = (props) => {
  if(props.total === 0){
    return(
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return(
    <div>
      <StatisticLine text='good' value={props.good} />
      <StatisticLine text='neutral' value={props.neutral} />
      <StatisticLine text='bad' value={props.bad} />
      <StatisticLine text='all' value={props.total} />
      <StatisticLine text='average' value={props.average} />
      <StatisticLine text='positive' value={props.positive + ' %'} />
    </div>
  )
}

const Button = (props) => (
      <button onClick={props.handleClick}>{props.text}</button>
  )

function App() {
  const [ good, setGood ] = useState(0)
  const [ neutral, setNeutral ] = useState(0)
  const [ bad, setBad ] = useState(0)
  const [ total, setTotal ] = useState(0)
  const [ average, setAverage ] = useState(0)
  const [ positive, setPositive ] = useState(0)

  const handleGoodClick = () => {
    const newGood = good +1
    setGood(newGood)
    const newTotal = newGood + neutral + bad
    setTotal(newTotal)
    setAverage((newGood + (bad*(-1))) / newTotal)
    setPositive((newGood/newTotal)*100)
  }

  const handleNeutralClick = () => {
    const newNeutral = neutral + 1
    setNeutral(newNeutral)
    const newTotal = good + newNeutral + bad
    setTotal(newTotal)
    setPositive((good/newTotal)*100)
  }
  const handleBadClick = () => {
    const newBad = bad +1
    setBad(newBad)
    const newTotal = good + neutral + newBad
    setTotal(newTotal)
    setAverage((good + (newBad*(-1))) / newTotal)
    setPositive((good/newTotal)*100)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <div>
        <Button handleClick={handleGoodClick} text='good' />
        <Button handleClick={handleNeutralClick} text='neutral' />
        <Button handleClick={handleBadClick} text='bad' />
      </div>
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} positive={positive}/>
    </div>
  )
}

export default App
