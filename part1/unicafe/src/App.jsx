import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>{props.text}</button>
  )
}

const Stats = (props) => {
  return (
    <p>{props.text}: {props.value}</p>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button text="Good" handleClick={() => setGood(good + 1)}/>
      <Button text="Neutral" handleClick={() => setNeutral(neutral + 1)}/>
      <Button text="Bad" handleClick={() => setBad(bad + 1)}/>

      <h1>Statistics</h1>
      <Stats text="Good" value={good} />
      <Stats text="Neutral" value={neutral} />
      <Stats text="Bad" value={bad} />
    </div>
  )
}

export default App
