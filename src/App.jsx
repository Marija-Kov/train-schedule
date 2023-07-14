import { useState } from 'react'
import './scss/main.scss'
import Form from './components/Form'
import Departure from './components/Departure'

function App() {
 const [departures, setDepartures] = useState([]);

 const runSetDepartures = (d) => {
  setDepartures(() => d)
 }

  return (
    <div className="container">
      <h1>Train schedule</h1>
      {!departures.length && 
      <Form 
       departures={departures} 
       runSetDepartures={runSetDepartures}
       />}
      {departures.length && 
       <div className="departures--container">
        <button onClick={() => runSetDepartures([])}>nazad</button>
        <div>
          <span>polazak</span>--
          <span>dolazak</span>--
          <span>broj voza</span>
        </div>
        {departures.map(d => (
          <Departure
           key={d.trainId}
           from={d.from}
           to={d.to}
           departureTime={d.departureTime}
           arrivalTime={d.arrivalTime}
           trainId={d.trainId}
          />
        ))}
        </div>
      }

    </div>
  )
}

export default App
